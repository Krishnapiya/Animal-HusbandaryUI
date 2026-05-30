# RBAC End-to-End Checklist

## Test Data

- Role `ADMIN`: full permissions on `test-page`, `rbac-admin`
- Role `DATA_ENTRY`: `list/save` on `test-page`, no `edit/delete`, no `rbac-admin`
- One user per role

## Scenario 1: Admin

1. Login as admin.
2. Open `Access Control` menu.
3. Create module `Master` and menu `Sample Menu` with slug/path.
4. Assign `list/save/edit/delete` to `DATA_ENTRY` for `Sample Menu`.
5. Save and verify no API error.
6. Verify created menu appears in sidebar after refresh/re-login.

Expected:
- Admin sees all configured menus and all CRUD buttons.
- Admin can modify permission matrix.

## Scenario 2: Restricted Role

1. Login as `DATA_ENTRY`.
2. Verify `Access Control` menu is hidden.
3. Open `User Registration`.
4. Verify `Add` button visibility follows `save` permission.
5. Verify edit/delete actions follow permissions.

Expected:
- No unauthorized menu visible.
- Unauthorized actions hidden in UI.

## Scenario 3: Backend Enforcement

1. Login as restricted user.
2. Call a blocked API directly (example: DELETE endpoint) with token.
3. Verify HTTP 403 response from backend.

Expected:
- Backend denies blocked actions even if UI is bypassed.
