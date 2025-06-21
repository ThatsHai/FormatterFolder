package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CookieService {
    public Cookie createCookie(String value) {
        Cookie cookie = new Cookie("refreshToken", value);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/auth");
        cookie.setMaxAge(7 * 24 * 60 * 60);
        return cookie;
    }

//    public String getRefreshToken(HttpServletRequest request) {
//        String refreshToken = Arrays.stream(request.getCookies())
//                .filter(c -> "refreshToken".equals(c.getName()))
//                .findFirst()
//                .map(Cookie::getValue)
//                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
//        return refreshToken;
//    }

    public String getRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED); // or return null/Optional
        }

        return Arrays.stream(cookies)
                .filter(c -> "refreshToken".equals(c.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
    }

    public Cookie deleteCookie() {
        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/auth");
        cookie.setMaxAge(0); //xoá cookie
        return cookie;
    }
}
