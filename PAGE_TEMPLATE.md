# New Page Template (React + Java + RBAC)

Use this checklist whenever you add a new page.

## 1) Pick one slug (important)

Choose one canonical slug and use it everywhere.

Example:
- `sample-department`

Must match in all places:
- Frontend route constant
- `PermissionGate`/`useCan`
- DB menu `slug`
- Backend `@RequirePermission(menu = "...")`

---

## 2) Frontend files (Analytical pattern)

Create under `src/pages/<page_name>/`:

- `index.jsx`
- `Form.jsx`
- `Filter.jsx`
- `List.jsx`

### `index.jsx` responsibilities

- Wire `DataTable`
- Provide `api_url`, `list_url`, `tableColumns`
- Add RBAC checks:
  - `const { canList, canSave, canEdit, canDelete } = useCan(PAGE_PATH)`
  - `canExport={can(PAGE_PATH, "export")}`

### `Form.jsx` responsibilities

- Use `useForm(...)`
- Submit `insert` and `edit`
- Keep fields minimal and page-specific

### `Filter.jsx` responsibilities

- Filter inputs only
- Update `filterFetchParams`

### `List.jsx` responsibilities

- Render rows and columns
- Edit/Delete action buttons
- `DeleteDialog` wiring

---

## 3) Frontend route/config wiring

### `src/config/routes.js`

Add:

```js
export const MY_PAGE_PATH = "my-page";
```

### `src/config/endpoints.js`

Add base URLs (trailing slash style):

```js
export const MY_PAGE_API_URL = "/admin/auth/master/my-page/";
export const MY_PAGE_LIST_URL = "/admin/auth/master/my-page/";
```

### `src/router.js`

- Import page + route constant
- Wrap with `PermissionGate` (`action="list"`)
- Add route entry

---

## 4) Backend files

Add in `utility-lib`:
- DTO
- Entity
- SearchBean
- Predicates

Add in `admin-service`:
- Repository
- ServiceImpl
- Controller

Controller pattern:
- `POST /save` -> `save`
- `PATCH /save` -> `edit`
- `GET /list/all` -> `list`
- `DELETE /delete/{id}` -> `delete`
- `POST /download-excel` -> `export` (optional)

Protect with:

```java
@RequirePermission(menu = "my-page", action = "list")
```

---

## 5) DB migration

Create table migration:
- `admin-service/src/main/resources/<page>-migration.sql`

Add optional RBAC menu registration snippet:

```sql
-- module (if needed)
INSERT INTO master.modules(name, slug, display_order, active)
VALUES ('Master', 'master', 10, true)
ON CONFLICT (slug) DO NOTHING;

-- menu
INSERT INTO master.menus(module_id, name, slug, path, display_order, active)
SELECT m.id, 'My Page', 'my-page', 'my-page', 1, true
FROM master.modules m
WHERE m.slug = 'master'
ON CONFLICT (module_id, slug) DO NOTHING;
```

---

## 6) Permission matrix steps

1. Open Access Control.
2. Ensure menu appears under target module.
3. Grant role rights for:
   - `list`, `save`, `edit`, `delete` (and `export` if used)
4. Save changes.
5. Re-login user if role changed.

---

## 7) Verification checklist

- API endpoint responds (200 with data)
- Route opens page
- No permission -> blocked as expected
- Edit/Delete buttons follow role permissions
- Backend blocks unauthorized direct API calls

---

## 8) Minimal `index.jsx` starter

```jsx
import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";
import { useAuthz } from "../../context/AuthzContext";
import { MY_PAGE_API_URL, MY_PAGE_LIST_URL } from "../../config/endpoints";
import { MY_PAGE_PATH } from "../../config/routes";
import useCan from "../../hooks/useCan";

const MyPage = () => {
  const { can } = useAuthz();
  const { canList, canSave, canEdit, canDelete } = useCan(MY_PAGE_PATH);

  const tableColumns = [
    { attr: "id", header: "ID" },
    { attr: "name", header: "Name" },
  ];

  return (
    <DataTable
      api_url={MY_PAGE_API_URL}
      list_url={MY_PAGE_LIST_URL}
      alertString="My Page"
      tableColumns={tableColumns}
      includeFilter={canList}
      disableAdd={!canSave}
      pageTitle="My Page"
      canList={canList}
      canEdit={canEdit}
      canDelete={canDelete}
      canExport={can(MY_PAGE_PATH, "export")}
    >
      <Filter />
      <FormDialog maxWidth="sm">
        <Form />
      </FormDialog>
      <List />
    </DataTable>
  );
};

export default MyPage;
```

