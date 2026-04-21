# Фича `admin` — админ-панель

## Назначение

Отдельная защищённая зона приложения для административных задач, визуально и по маршруту отделена от основного рабочего UI («Патрубки» на `/`). Код организован в **feature-based** стиле под каталогом `src/features/admin/`.

## Правила разработки (feature-based и стили)

- **Слои:** UI-компоненты в `ui/`, композиция страниц и точки входа маршрутов в `pages/`. По мере роста фичи добавлять `api/`, `hooks/`, `model/` рядом с фичей, не смешивать доменную логику основного приложения без необходимости.
- **Стили:** только через общий MUI-теминг в [`src/theme.js`](../../theme.js) — кастомные варианты `typography`, `components.styleOverrides`, кастомные варианты компонентов (например `Paper` с `variant="adminShell"`), плюс `sx` с обращением к токенам темы (`theme.spacing`, `theme.palette`, `theme.shape`, `theme.breakpoints`). **Не** заводить отдельные `.css` для каркаса админки внутри фичи.
- **Импорты из приложения:** допустимы общие части (`components/Layout`, `context/AuthContext`, `api/http` и т.д.) при необходимости.

## Дерево каталогов

```text
features/admin/
  README.md          ← этот файл (живой документ)
  index.js           ← публичные экспорты фичи
  pages/
    AdminPage.jsx
  ui/
    AdminPageChrome.jsx
    AdminPageBody.jsx
```

## Реестр файлов

| Файл | Назначение | Статус |
|------|------------|--------|
| `index.js` | Barrel: экспорт `AdminPage`, `AdminIndexOutletFallback` для роутера. | каркас |
| `pages/AdminPage.jsx` | Корневая страница: `Layout` с заголовком «Админ-панель», `chrome`, дочерний контент с `Outlet` внутри `AdminPageBody`. Экспорт пустого индексного fallback для вложенного маршрута. | каркас |
| `ui/AdminPageChrome.jsx` | Полоса под `AppBar`: подзаголовок, без ссылок и кнопок навигации. | каркас |
| `ui/AdminPageBody.jsx` | Основная область: текст-заглушка, `Paper variant="adminShell"`, вложенный `Outlet`. | каркас |
| `README.md` | Конвенции, дерево, реестр, маршрутизация, заметки по безопасности. | каркас |
| [`src/components/AdminRoleRoute.jsx`](../../components/AdminRoleRoute.jsx) (вне фичи) | Маршрутный гард: после успешной авторизации допускает `/admin` только при наличии **`ROLE_ADMIN`** в `user.roles`; иначе редирект на `/`. | готово |
| [`src/utils/userRoles.js`](../../utils/userRoles.js) (вне фичи) | `ROLE_ADMIN`, `userHasAdminRole(user)` — единая проверка роли по данным `GET /api/current-user`. | готово |
| [`src/components/Layout.jsx`](../../components/Layout.jsx) (вне фичи) | Меню по клику на username: «К патрубкам» на маршруте `/admin`; «Админ-панель» — только при `ROLE_ADMIN` вне `/admin`; «Сменить пароль». | готово |

*При добавлении файлов или функционала обновляйте таблицу и дерево.*

## Маршрутизация

- URL: **`/admin`** (см. [`src/App.jsx`](../../App.jsx)).
- Родительский маршрут: **`ProtectedRoute`** → **`AdminRoleRoute`** → `AdminPage` (сначала сессия и логин, затем роль администратора).
- Вложенный **`index`** с элементом `AdminIndexOutletFallback` — заготовка под будущие подмаршруты; контент индекса сейчас пустой (`null`), общая заглушка — в `AdminPageBody`.
- **Вход на админку:** пункт «Админ-панель» в меню по username в [`Layout.jsx`](../../components/Layout.jsx) (виден только при `ROLE_ADMIN`); прямой URL `/admin` по-прежнему работает. После успешного логина и при заходе на `/login` с активной сессией админ перенаправляется на **`/admin`** ([`useLogin.js`](../../hooks/useLogin.js), [`Login.jsx`](../../pages/Login.jsx)). С админки возврат на основное приложение — пункт «К патрубкам» в том же меню.

## Расширение темы для админки

В [`src/theme.js`](../../theme.js):

- **`typography.adminChromeTitle`** — текст полосы под `AppBar`.
- **`typography.adminPageStub`** — текст заглушки в теле страницы.
- **`components.MuiPaper.variants`** — вариант **`adminShell`**: фон `background.paper`, рамка `divider`, скругление из `shape`.
- В JSX для кастомных вариантов типографики задан явный **`component="p"`**, чтобы не зависеть от глобального `variantMapping`.

## Безопасность

- **Не залогинен:** `ProtectedRoute` по-прежнему ведёт на **`/login`** (после проверки `GET /api/current-user`).
- **Залогинен, нет роли администратора:** [`AdminRoleRoute`](../../components/AdminRoleRoute.jsx) перенаправляет на **`/`** (основное приложение).
- **Залогинен, в `user.roles` есть `ROLE_ADMIN`:** отображается админ-панель. Строка роли совпадает с authority Spring Security на бэкенде (`UserDetailsServiceImpl` для роли «Администратор»).
- API под админку на сервере по-прежнему нужно защищать отдельно (например `hasRole("ADMIN")` на `/api/admin/**` в `SecurityConfig`); клиентский гард только улучшает UX и не заменяет проверки на сервере.
