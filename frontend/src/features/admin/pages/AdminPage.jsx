import Layout from '../../../components/Layout'
import { AdminPageBody } from '../ui/AdminPageBody'

/**
 * Корневая страница фичи `admin`: общий Layout и тело с `Outlet` для вложенных маршрутов.
 */
export function AdminPage() {
  return (
    <Layout title="Админ-панель" flush>
      <AdminPageBody />
    </Layout>
  )
}

/** Пустой индексный маршрут `/admin`: контент появится при добавлении подразделов. */
export function AdminIndexOutletFallback() {
  return null
}
