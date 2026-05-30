# Spring Boot RBAC Blueprint

## Required Endpoints

- `GET /api/me/navigation`
- `GET /api/me/permissions`
- `GET /api/admin/modules`
- `POST /api/admin/modules`
- `GET /api/admin/menus`
- `POST /api/admin/menus`
- `GET /api/admin/roles`
- `GET /api/admin/roles/{roleId}/permissions`
- `PATCH /api/admin/roles/{roleId}/permissions`

## DTO Contracts

### `GET /api/me/navigation`
```json
[
  {
    "title": "User Management",
    "segment": "users",
    "children": [
      { "title": "Users", "segment": "test-page" }
    ]
  }
]
```

### `GET /api/me/permissions`
```json
{
  "test-page": { "list": true, "save": true, "edit": true, "delete": false },
  "rbac-admin": { "list": true, "save": false, "edit": false, "delete": false }
}
```

## Service Contract

```java
public interface PermissionService {
    Map<String, Map<String, Boolean>> getUserPermissionMap(Long userId);
    List<NavigationNodeDto> getUserNavigation(Long userId);
    void saveRolePermissions(Long roleId, PermissionUpdateRequest request);
    boolean hasPermission(Long userId, String menuKey, String actionKey);
}
```

## Backend Enforcement

- Add a custom annotation `@RequirePermission(menu = "test-page", action = "save")`.
- Implement an aspect/interceptor that resolves user from JWT and checks `PermissionService.hasPermission`.
- Return `403` when permission is missing.

## Cache Strategy

- Cache `roleId -> permission matrix` and `userId -> navigation`.
- Invalidate caches when:
  - module/menu is changed
  - role permission matrix is changed
  - user-role mapping is changed
