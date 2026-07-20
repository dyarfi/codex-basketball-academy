import AdminLayout from 'src/components/AdminLayout/AdminLayout'
import UsersComponent from 'src/pages/AdminPanelPage/UsersComponent'

const AdminUsersPage = () => {
  return (
    <AdminLayout
      metaTags={{
        title: 'Users Management Page',
        description: 'Manage users in Admin Panel',
      }}
    >
      <UsersComponent />
    </AdminLayout>
  )
}

export default AdminUsersPage
