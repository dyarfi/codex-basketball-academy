import React from 'react'

import { AdminLayout } from 'src/components/AdminLayout/AdminLayout'

import PlayerStatsComponent from '../AdminPanelPage/PlayerStatsComponent'

const AdminPlayerStatsPage = () => {
  return (
    <AdminLayout>
      <PlayerStatsComponent />
    </AdminLayout>
  )
}

export default AdminPlayerStatsPage
