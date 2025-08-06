package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.request.PermissionRequest;
import com.thesis_formatter.thesis_formatter.dto.request.RoleRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.PermissionResponse;
import com.thesis_formatter.thesis_formatter.dto.response.RoleResponse;
import com.thesis_formatter.thesis_formatter.entity.Role;
import com.thesis_formatter.thesis_formatter.service.PermissionService;
import com.thesis_formatter.thesis_formatter.service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/roles")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {
    RoleService roleService;

    @PostMapping
    APIResponse<Role> create(@RequestBody RoleRequest request) {
        return APIResponse.<Role>builder()
                .code("200")
                .result(roleService.create(request))
                .build();
    }

    @GetMapping
    APIResponse<List<RoleResponse>> getAll() {
        return APIResponse.<List<RoleResponse>>builder()
                .code("200")
                .result(roleService.getAll())
                .build();
    }

    @DeleteMapping("/{role}")
    APIResponse<Void> delete(@PathVariable String role) {
        roleService.delete(role);
        return APIResponse.<Void>builder()
                .code("200").build();
    }
}

