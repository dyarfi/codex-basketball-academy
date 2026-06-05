import React from 'react'

import AdminLayout from 'src/components/AdminLayout'
import { AttendanceComponent } from 'src/pages/AdminPanelPage/AttendanceComponent'

const AdminAttendancePage = () => {
  return (
    <AdminLayout>
      <AttendanceComponent />
    </AdminLayout>
  )
}

export default AdminAttendancePage
