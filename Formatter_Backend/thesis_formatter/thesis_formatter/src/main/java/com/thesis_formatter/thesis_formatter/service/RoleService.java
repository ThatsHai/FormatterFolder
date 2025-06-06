package com.thesis_formatter.thesis_formatter.service;


import com.thesis_formatter.thesis_formatter.dto.request.RoleRequest;
import com.thesis_formatter.thesis_formatter.dto.response.RoleResponse;
import com.thesis_formatter.thesis_formatter.entity.Role;
import com.thesis_formatter.thesis_formatter.mapper.RoleMapper;
import com.thesis_formatter.thesis_formatter.repo.PermissionRepo;
import com.thesis_formatter.thesis_formatter.repo.RoleRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepo roleRepo;
    RoleMapper roleMapper;
    PermissionRepo permissionRepo;

    public RoleResponse create(RoleRequest request) {
        var role = roleMapper.toRole(request);

        var permissions = permissionRepo.findAllById(request.getPermissions());
        role.setPermissions(new HashSet<>(permissions));

        role = roleRepo.save(role);
        return roleMapper.toRoleResponse(role);
    }

    public List<RoleResponse> getAll() {
        var roles = roleRepo.findAll();
        return roles.stream().map(roleMapper::toRoleResponse).collect(Collectors.toList());
    }

    public void delete(String role) {
        roleRepo.deleteById(role);
    }
}
