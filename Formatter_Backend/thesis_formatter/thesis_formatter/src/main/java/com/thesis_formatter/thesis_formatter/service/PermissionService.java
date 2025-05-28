package com.thesis_formatter.thesis_formatter.service;


import com.thesis_formatter.thesis_formatter.dto.request.PermissionRequest;
import com.thesis_formatter.thesis_formatter.dto.response.PermissionResponse;
import com.thesis_formatter.thesis_formatter.entity.Permission;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.mapper.PermissionMapper;
import com.thesis_formatter.thesis_formatter.repo.PermissionRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionService {
    PermissionRepo permissionRepo;
    PermissionMapper permissionMapper;

    public PermissionResponse create(PermissionRequest request) {
        Permission permission = permissionMapper.toPermission(request);
        if (permissionRepo.existsByName(permission.getName())) {
            throw new AppException(ErrorCode.PERMISSION_EXISTED);
        }
        permission = permissionRepo.save(permission);
        return permissionMapper.toPermissionResponse(permission);
    }

    public List<PermissionResponse> getAll() {
        var permissions = permissionRepo.findAll();
        return permissions.stream().map(permissionMapper::toPermissionResponse).toList();
    }

    public void delete(String permissionName) {
        permissionRepo.deleteById(permissionName);
    }
}
