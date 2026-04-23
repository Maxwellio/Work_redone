# Фича `admin` — админ-панель

## Назначение

Отдельная защищённая зона приложения для административных задач, визуально и по маршруту отделена от основного рабочего UI («Патрубки» на `/`). Код организован в **feature-based** стиле под каталогом `src/features/admin/`.

## Правила разработки (feature-based и стили)

- **Слои:** UI в `ui/`, страницы и точки входа в `pages/`, HTTP-вызовы в `api/`. По мере роста фичи добавлять `hooks/`, `model/` рядом с фичей, не смешивать доменную логику основного приложения без необходимости.
- **Стили:** через общий MUI-теминг в [`src/theme.js`](../../theme.js) — кастомные варианты `typography`, `components.MuiPaper.variants` (например `Paper` с `variant="adminShell"`, если используется), плюс `sx` с токенами темы. **Не** заводить отдельные `.css` для каркаса админки внутри фичи.
- **Импорты из приложения:** допустимы общие части (`components/Layout`, `context/AuthContext`, [`api/http`](../../api/http.js) и т.д.).

## Дерево каталогов

```text
features/admin/
  README.md
  index.js
  api/
    adminUsers.js       ← GET /api/admin/users
    adminReferences.js  ← роли, подразделения (см. ниже)
  pages/
    AdminPage.jsx
  ui/
    AdminPageBody.jsx
    AdminUserFormPanel.jsx
    AdminWorkspaceMock.jsx
```

## Основная рабочая зона

На широком экране две колонки (пропорция ориентировочно **7:3**): **слева** — поиск и таблица пользователей; **справа** — **форма** [`AdminUserFormPanel`](ui/AdminUserFormPanel.jsx): при клике по строке в таблицу подставляются данные выбранного пользователя (в т.ч. `isFirstLogin` из `GET /api/admin/users`). Без выбранной строки — значения по умолчанию для будущего сценария «добавить» (роль «Пользователь», `orgId` 30, даты: сегодня / 01.01.2100). Сохранение на сервер не реализовано. Даты: **MUI X DatePicker** + **dayjs** (локаль `ru`).

**API (сессия админа, `credentials: 'include'`):**

| Метод | Путь | Назначение |
|-------|------|------------|
| GET | `/api/admin/users` | Список пользователей, поле `isFirstLogin` в JSON. |
| GET | `/api/admin/roles` | Все роли из `spr_role` (селект «Роль»). |
| GET | `/api/admin/organizations/choices` | Подразделения только `id` 30 и 99 (селект «Подразделение»). |

- **Таблица слева:** колонок подразделения нет; `orgId` в JSON строки. Клик по строке: выбор/снятие, стили как у [`HomeTable`](../../components/HomeTable.jsx) / [`Home.css`](../../styles/Home.css).
- **Пароль:** в API не отдаётся; в форме при выбранном пользователе поле пустое.

## Реестр файлов

| Файл | Назначение | Статус |
|------|------------|--------|
| `index.js` | Barrel: экспорт `AdminPage`, `AdminIndexOutletFallback` для роутера. | готово |
| `api/adminUsers.js` | `GET /api/admin/users` — список пользователей. | готово |
| `api/adminReferences.js` | `GET /api/admin/roles`, `GET /api/admin/organizations/choices`. | готово |
| `pages/AdminPage.jsx` | Корневая страница: `Layout` с заголовком «Админ-панель» (без `chrome` под `AppBar`, класс `layout-sticky--admin` в `Layout` для визуального разделения), дочерний контент с `Outlet` внутри `AdminPageBody`. | готово |
| `ui/AdminPageBody.jsx` | Секция: `AdminWorkspaceMock`, вложенный `Outlet` для будущих подмаршрутов. | готово |
| `ui/AdminUserFormPanel.jsx` | Правая панель: селекты (роль, подразделение 30/99), ФИО, логин, пароль, телефон, почта, даты, примечание, чекбоксы «Подключен» / «Первое подключение». | готово |
| `ui/AdminWorkspaceMock.jsx` | Таблица, поиск, `AdminUserFormPanel`. | готово |
| `README.md` | Конвенции, дерево, реестр, маршрутизация, безопасность. | актуален |
| [`src/components/AdminRoleRoute.jsx`](../../components/AdminRoleRoute.jsx) (вне фичи) | Гард: `/admin` только при **`ROLE_ADMIN`**; иначе редирект на `/`. | готово |
| [`src/utils/userRoles.js`](../../utils/userRoles.js) (вне фичи) | `userHasAdminRole(user)` — по `GET /api/current-user`. | готово |
| [`src/components/Layout.jsx`](../../components/Layout.jsx) (вне фичи) | Меню: «К патрубкам» на `/admin`, «Админ-панель» вне `/admin` при `ROLE_ADMIN`, смена пароля, выход. | готово |

*При добавлении файлов или функционала обновляйте таблицу и дерево.*

## Маршрутизация

- URL: **`/admin`** (см. [`src/App.jsx`](../../App.jsx)).
- Родительский маршрут: **`ProtectedRoute`** → **`AdminRoleRoute`** → `AdminPage`.
- Вложенный **`index`** с элементом `AdminIndexOutletFallback` — контент индекса пустой (`null`); основной UI — `AdminPageBody` / `AdminWorkspaceMock`.
- **Вход на админку:** пункт в меню username в [`Layout.jsx`](../../components/Layout.jsx) (только при `ROLE_ADMIN`); прямой URL `/admin`. После логина админ может перенаправляться на `/admin` ([`useLogin.js`](../../hooks/useLogin.js), [`Login.jsx`](../../pages/Login.jsx)). «К патрубкам» — возврат на `/`.

## Расширение темы

В [`src/theme.js`](../../theme.js) для админки по-прежнему доступны, при необходимости:

- **`typography.adminPageStub`**
- **`components.MuiPaper.variants` → `adminShell`**

## Безопасность

- **Не залогинен:** `ProtectedRoute` ведёт на **`/login`**.
- **Нет роли админа:** [`AdminRoleRoute`](../../components/AdminRoleRoute.jsx) → **`/`**.
- **Админ:** отображается панель; бэкенд защищает **`/api/admin/**`** (например `hasRole("ADMIN")`); клиентский гард не заменяет проверки на сервере.
