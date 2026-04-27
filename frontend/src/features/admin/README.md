# Фича `admin` — админ-панель

## Назначение

Отдельная защищённая зона приложения для административных задач, визуально и по маршруту отделена от основного рабочего UI («Патрубки» на `/`). Код организован в **feature-based** стиле под каталогом `src/features/admin/`.

## Правила разработки (feature-based и стили)

- **Слои:** UI в `ui/`, страницы и точки входа в `pages/`, HTTP-вызовы в `api/`. По мере роста фичи добавлять `hooks/`, `model/` рядом с фичей, не смешивать доменную логику основного приложения без необходимости.
- **Стили:** базово через MUI (`sx`, токены темы), но для табличной сетки в админке используется локальный файл [`ui/admin-workspace.css`](ui/admin-workspace.css) (плоская таблица без скруглений и без sticky-оверлея).
- **Импорты из приложения:** допустимы общие части (`components/Layout`, `context/AuthContext`, [`api/http`](../../api/http.js) и т.д.).

## Дерево каталогов

```text
features/admin/
  README.md
  index.js
  api/
    adminUsers.js       ← GET /api/admin/users
    adminReferences.js  ← роли, подразделения
    adminReferenceCache.js  ← кэш в памяти (ensure*)
  pages/
    AdminPage.jsx
  constants.js
  ui/
    AdminPageBody.jsx
    AdminUserFormPanel.jsx
    AdminWorkspaceMock.jsx
    admin-workspace.css
```

## Основная рабочая зона

На широком экране рабочая область делится на колонки примерно **8:2**:
- **Слева** — поиск, фильтры и таблица пользователей.
- **Справа** — форма [`AdminUserFormPanel`](ui/AdminUserFormPanel.jsx), но **только при выборе строки** в таблице.

Сохранение на сервер не реализовано.

**API (сессия админа, `credentials: 'include'`):**

| Метод | Путь | Назначение |
|-------|------|------------|
| GET | `/api/admin/users` | Список пользователей, поле `isFirstLogin` в JSON. |
| GET | `/api/admin/roles` | Все роли из `spr_role` (селект «Роль»). |
| GET | `/api/admin/organizations/struct` | Подразделения только `id` 30 и 99 (селект «Подразделение»). |

- **Таблица слева:** колонок подразделения нет; `orgId` приходит в JSON строки. Клик по строке — выбор/снятие. Таблица оформлена отдельным стилем [`ui/admin-workspace.css`](ui/admin-workspace.css): плоская сетка, без скруглений, без sticky-залипания шапки поверх рамки.
- **Фильтры в панели слева:** строка поиска + селект «Подразделение» (с первой опцией **«Все подразделения»**) + два взаимоисключающих чекбокса «Только администраторы» / «Только пользователи». Фильтры комбинируются по логике AND.
- **Пароль:** в API не отдаётся; в форме при выбранном пользователе поле пустое.
- **Даты в форме:** нативные `TextField type="date"` (без сторонних date-picker), `today()` считается в локальном часовом поясе. Справа от каждого поля есть кнопка-крестик для сброса даты на текущую.

## Реестр файлов

| Файл | Назначение | Статус |
|------|------------|--------|
| `index.js` | Barrel: экспорт `AdminPage`, `AdminIndexOutletFallback` для роутера. | готово |
| `constants.js` | Общие константы фичи (`NM_USER`, `NM_ADMIN`). | готово |
| `api/adminUsers.js` | `GET /api/admin/users` — список пользователей. | готово |
| `api/adminReferences.js` | `GET /api/admin/roles`, `GET /api/admin/organizations/struct`. | готово |
| `api/adminReferenceCache.js` | `ensureAdminRoles`, `ensureAdminOrgStruct` — один запрос на сессию, дедуп параллельных вызовов. | готово |
| `pages/AdminPage.jsx` | Корневая страница: `Layout` с заголовком «Админ-панель» (без `chrome` под `AppBar`, класс `layout-sticky--admin` в `Layout` для визуального разделения), дочерний контент с `Outlet` внутри `AdminPageBody`. | готово |
| `ui/AdminPageBody.jsx` | Секция: `AdminWorkspaceMock`, вложенный `Outlet` для будущих подмаршрутов. | готово |
| `ui/AdminUserFormPanel.jsx` | Правая панель: селекты (роль, подразделение 30/99), ФИО, логин, пароль, телефон, почта, даты (`type="date"` + кнопки сброса на сегодня), примечание, чекбоксы «Подключен» / «Первое подключение». | готово |
| `ui/AdminWorkspaceMock.jsx` | Левая зона: таблица, поиск, фильтр подразделения, взаимоисключающие фильтры ролей; правая форма показывается только при выбранной строке. | готово |
| `ui/admin-workspace.css` | Локальные стили админ-таблицы (плоская сетка и контейнер). | готово |
| `README.md` | Конвенции, дерево, реестр, маршрутизация, безопасность. | обновлён |
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
