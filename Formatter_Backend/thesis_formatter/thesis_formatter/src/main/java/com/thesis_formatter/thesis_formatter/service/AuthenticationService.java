package com.thesis_formatter.thesis_formatter.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.thesis_formatter.thesis_formatter.dto.request.AuthenticationRequest;
import com.thesis_formatter.thesis_formatter.dto.response.AuthenticationResponse;
import com.thesis_formatter.thesis_formatter.entity.Account;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.repo.AccountRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    AccountRepo accountRepo;

    @NonFinal
    protected static final String SIGNER_KEY = "kDnLkIQNLqJ4Bm2AoiGLRQwk4RUUsrfVrT7Q0I3uxMx+/ngrZnKnOeCtIXpcmUF6";

    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {

        if (accountRepo == null) {
            throw new IllegalStateException("accountRepo chưa được khởi tạo!");
        }
        var user = accountRepo.findByUserId(authenticationRequest.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authenticated = passwordEncoder.matches(authenticationRequest.getPassword(), user.getPassword());
        if (!authenticated) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        try {
            var token = generateToken(authenticationRequest.getUserId());
            return AuthenticationResponse.builder()
                    .token(token)
                    .authenticated(true)
                    .build();

        } catch (KeyLengthException e) {
            throw new RuntimeException(e);
        }
    }

    private String generateToken(String username) throws KeyLengthException {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(username) //user
                .issuer("https://github.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli() //after 1 hour
                ))
                .claim("customClaim", "Custom")
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
        PasswordEncoder bcryptEncoder = new BCryptPasswordEncoder(10);
        account.setPassword(bcryptEncoder.encode(account.getPassword()));
    }
}
