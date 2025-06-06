package com.thesis_formatter.thesis_formatter.controller;

import com.nimbusds.jose.JOSEException;
import com.thesis_formatter.thesis_formatter.dto.request.AuthenticationRequest;
import com.thesis_formatter.thesis_formatter.dto.request.IntrospectRequest;
import com.thesis_formatter.thesis_formatter.dto.request.LogoutRequest;
import com.thesis_formatter.thesis_formatter.dto.request.RefeshRequest;
import com.thesis_formatter.thesis_formatter.dto.response.AuthenticationResponse;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.IntrospectResponse;
import com.thesis_formatter.thesis_formatter.service.AuthenticationService;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/token")
    public APIResponse<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);
        return APIResponse.<AuthenticationResponse>builder()
                .code("200")
                .result(result)
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
    public APIResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);
        return APIResponse.<Void>builder()
                .code("200")
                .build();
    }

    @PostMapping("/refesh")
    public APIResponse<AuthenticationResponse> refesh(@RequestBody RefeshRequest request) throws ParseException, JOSEException {
        var result = authenticationService.refeshToken(request);
        return APIResponse.<AuthenticationResponse>builder()
                .code("200")
                .result(result)
                .build();
    }
}
