package com.example.admin;

import com.example.security.PermissionService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/roles")
public class RolePermissionAdminController {

    private final PermissionService permissionService;

    public RolePermissionAdminController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @PatchMapping("/{roleId}/permissions")
    public void updateRolePermissions(@PathVariable Long roleId, @RequestBody Object payload) {
        // Persist payload into role_menu_permissions table.
        // ...
        permissionService.evictPermissionCacheForRole(roleId);
    }
}
