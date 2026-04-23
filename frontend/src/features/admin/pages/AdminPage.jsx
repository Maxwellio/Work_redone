import Layout from '../../../components/Layout'
import { AdminPageChrome } from '../ui/AdminPageChrome'
import { AdminPageBody } from '../ui/AdminPageBody'

/**
 * Корневая страница фичи `admin`: общий Layout и тело с `Outlet` для вложенных маршрутов.
 */
export function AdminPage() {
  return (
    <Layout title="Админ-панель" chrome={<AdminPageChrome />} flush>
      <AdminPageBody />
    </Layout>
  )
}

/** Пустой индексный маршрут `/admin`: контент появится при добавлении подразделов. */
export function AdminIndexOutletFallback() {
  return null
}
