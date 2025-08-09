package com.thesis_formatter.thesis_formatter.configuration;

import com.thesis_formatter.thesis_formatter.dto.request.RoleRequest;
import com.thesis_formatter.thesis_formatter.entity.Account;
import com.thesis_formatter.thesis_formatter.entity.Permission;
import com.thesis_formatter.thesis_formatter.entity.Role;
import com.thesis_formatter.thesis_formatter.entity.Student;
import com.thesis_formatter.thesis_formatter.repo.AccountRepo;
import com.thesis_formatter.thesis_formatter.repo.PermissionRepo;
import com.thesis_formatter.thesis_formatter.repo.RoleRepo;
import com.thesis_formatter.thesis_formatter.service.PermissionService;
import com.thesis_formatter.thesis_formatter.service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;
    RoleRepo roleRepository;

    @NonFinal
    static final String ADMIN_USER_NAME = "admin";

    @NonFinal
    static final String ADMIN_PASSWORD = "admin123";

    @Bean
    ApplicationRunner applicationRunner(AccountRepo accountRepo, RoleService roleService, PermissionService permissionService, PermissionRepo permissionRepo) {
        return args -> {
            if (accountRepo.findByUserId(ADMIN_USER_NAME).isEmpty()) {
                roleRepository.save(Role.builder()
                        .name("STUDENT")
                        .description("Student role")
                        .build());
                Permission permission1 = Permission.builder()
                        .name("PROGRESS")
                        .build();
                Permission permission2 = Permission.builder()
                        .name("NOTIFICATION")
                        .build();
                Permission permission3 = Permission.builder()
                        .name("FORM_RECORD")
                        .build();
                permissionRepo.save(permission1);
                permissionRepo.save(permission2);
                permissionRepo.save(permission3);

                Set<String> teacherSet = new HashSet<>();
                teacherSet.add("PROGRESS");
                teacherSet.add("NOTIFICATION");
                teacherSet.add("FORM_RECORD");

                Role teacherRole = roleService.create(
                        RoleRequest.builder()
                                .name("TEACHER")
                                .description("Teacher role")
                                .permissions(teacherSet)
                                .build()
                );

                roleRepository.save(teacherRole);

                Set<String> adminSet = new HashSet<>();
                teacherSet.add("NOTIFICATION");

                Role adminRole = roleService.create(
                        RoleRequest.builder()
                                .name("ADMIN")
                                .description("admin role")
                                .permissions(adminSet)
                                .build()
                );

                roleRepository.save(adminRole);


                Account account = Account.builder()
                        .userId("admin")
                        .name(ADMIN_USER_NAME)
                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
                        .role(adminRole)
                        .build();
                accountRepo.save(account);
                log.warn("created admin account");
            }
        };
    }
}
