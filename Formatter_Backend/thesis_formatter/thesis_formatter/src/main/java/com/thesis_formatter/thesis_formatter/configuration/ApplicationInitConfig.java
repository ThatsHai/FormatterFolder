package com.thesis_formatter.thesis_formatter.configuration;

import com.thesis_formatter.thesis_formatter.entity.Account;
import com.thesis_formatter.thesis_formatter.enums.Role;
import com.thesis_formatter.thesis_formatter.repo.AccountRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;

@Configuration
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(AccountRepo accountRepo) {
        return args -> {
            if (accountRepo.findByUserId("admin").isEmpty()) {
                var roles = new HashSet<String>();
                roles.add(Role.ADMIN.name());
                Account account = Account.builder()
                        .userId("admin")
                        .password(passwordEncoder.encode("admin"))
                        .roles(roles)
                        .build();
                accountRepo.save(account);
                log.warn("created admin account");
            }
        };
    }
}
