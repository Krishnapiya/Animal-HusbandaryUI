package com.example.security;

public interface PermissionService {
    boolean hasPermission(Long userId, String menuKey, String actionKey);
    void evictPermissionCacheForRole(Long roleId);
}
