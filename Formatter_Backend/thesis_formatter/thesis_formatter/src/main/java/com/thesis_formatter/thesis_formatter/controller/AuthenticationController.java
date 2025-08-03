package com.thesis_formatter.thesis_formatter.controller;

import com.nimbusds.jose.JOSEException;
import com.thesis_formatter.thesis_formatter.dto.request.*;
import com.thesis_formatter.thesis_formatter.dto.response.AuthenticationResponse;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.IntrospectResponse;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.service.AuthenticationService;
import com.thesis_formatter.thesis_formatter.service.CookieService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin
public class AuthenticationController {

    AuthenticationService authenticationService;
    CookieService cookieService;

    @PostMapping("/token")
    public APIResponse<AuthenticationResponse> login(@RequestBody AuthenticationRequest request, HttpServletResponse response) {
        AuthenticationResponse result = authenticationService.authenticate(request);

        Cookie cookie = cookieService.createCookie(result.getRefreshtoken());
        response.addCookie(cookie);

        return APIResponse.<AuthenticationResponse>builder()
                .code("200")
                .result(AuthenticationResponse.builder()
                        .accesstoken(result.getAccesstoken())
                        .authenticated(true)
                        .build())
                .build();
    }

    @PostMapping("/introspect")
    public APIResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
        return APIResponse.<IntrospectResponse>builder()
                .code("200")
                .result(result)
                .build();
    }

    @PostMapping("/logout")
    public APIResponse<Void> logout(HttpServletRequest request, HttpServletResponse response) throws ParseException, JOSEException {

        String refreshToken = cookieService.getRefreshToken(request);

        authenticationService.logout(LogoutRequest.builder()
                .refreshToken(refreshToken)
                .build());

        Cookie cookie = cookieService.deleteCookie();
        response.addCookie(cookie);
        return APIResponse.<Void>builder()
                .code("200")
                .build();
    }

    @PostMapping("/refresh")
    public APIResponse<AuthenticationResponse> refresh(HttpServletRequest request, HttpServletResponse response) throws ParseException, JOSEException {
        //get cookie
        String refreshToken = cookieService.getRefreshToken(request);

        AuthenticationResponse result = authenticationService.refeshToken(RefreshRequest.builder().refreshToken(refreshToken).build());

        //new coookie
        Cookie cookie = cookieService.createCookie(result.getRefreshtoken());
        response.addCookie(cookie);

        return APIResponse.<AuthenticationResponse>builder()
                .code("200")
                .result(AuthenticationResponse.builder()
                        .accesstoken(result.getAccesstoken())
                        .authenticated(true)
                        .build())
                .build();
    }

    @PostMapping("/changePassword")
    public APIResponse<Map<String, Object>> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        return authenticationService.changePassword(changePasswordRequest);
    }
}
