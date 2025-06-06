package com.thesis_formatter.thesis_formatter.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.thesis_formatter.thesis_formatter.dto.request.AuthenticationRequest;
import com.thesis_formatter.thesis_formatter.dto.request.IntrospectRequest;
import com.thesis_formatter.thesis_formatter.dto.request.LogoutRequest;
import com.thesis_formatter.thesis_formatter.dto.request.RefeshRequest;
import com.thesis_formatter.thesis_formatter.dto.response.AuthenticationResponse;
import com.thesis_formatter.thesis_formatter.dto.response.IntrospectResponse;
import com.thesis_formatter.thesis_formatter.entity.Account;
import com.thesis_formatter.thesis_formatter.entity.InvalidatedToken;
import com.thesis_formatter.thesis_formatter.entity.Role;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.repo.AccountRepo;
import com.thesis_formatter.thesis_formatter.repo.InvalidatedTokenRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    AccountRepo accountRepo;
    PasswordEncoder passwordEncoder;
    private final InvalidatedTokenRepo invalidatedTokenRepo;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refeshable-duration}")
    protected long REFESHABLE_DURATION;

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();

        boolean isValid = true;
        try {
            verifyToken(token, false);
        } catch (AppException e) {
            isValid = false;
        }

        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {

        var user = accountRepo.findByUserId(authenticationRequest.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));


        boolean authenticated = passwordEncoder.matches(authenticationRequest.getPassword(), user.getPassword());
        if (!authenticated) {
            throw new AppException(ErrorCode.INCORRECT_PASSWORD);
        }
        try {
            var token = generateToken(user);
            return AuthenticationResponse.builder()
                    .token(token)
                    .authenticated(true)
                    .build();

        } catch (KeyLengthException e) {
            throw new RuntimeException(e);
        }
    }

    private String generateToken(Account account) throws KeyLengthException {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(account.getUserId()) //user
                .issuer("https://github.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(account))
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot sign JWT object", e);
            throw new RuntimeException(e);
        }
    }

    public void encodePassword(Account account) {
        account.setPassword(passwordEncoder.encode(account.getPassword()));
    }

    private String buildScope(Account account) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        Role role = account.getRole();
        stringJoiner.add("ROLE_" + role.getName());

        if (!CollectionUtils.isEmpty(role.getPermissions()))
            role.getPermissions().forEach(permission -> stringJoiner.add(permission.getName()));
        return stringJoiner.toString();
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            var signToken = verifyToken(request.getToken(), true);

            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .id(jit)
                    .expiryTime(expiryTime)
                    .build();
            invalidatedTokenRepo.save(invalidatedToken);
        } catch (AppException e) {
            log.info("Token expired");
        }
    }

    public AuthenticationResponse refeshToken(RefeshRequest request) throws ParseException, JOSEException {
        var signJWT = verifyToken(request.getToken(), true);

        String jit = signJWT.getJWTClaimsSet().getJWTID();
        Date expiryTime = signJWT.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .id(jit)
                .expiryTime(expiryTime)
                .build();
        invalidatedTokenRepo.save(invalidatedToken);

        String userId = signJWT.getJWTClaimsSet().getSubject();
        Account user = accountRepo.findByUserId(userId).orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        var token = generateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    private SignedJWT verifyToken(String token, boolean isRefesh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiration = (isRefesh) ?
                new Date(signedJWT.getJWTClaimsSet().getExpirationTime().toInstant().plus(REFESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();
        var verified = signedJWT.verify(verifier);

        if (!(verified && expiration.after(new Date()))) {
            log.error("unauthenticated token");
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        if (invalidatedTokenRepo.existsById(signedJWT.getJWTClaimsSet().getJWTID())) {
            log.error("find invalid token");
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        return signedJWT;
    }
}
