import React from 'react'

import { AdminLayout } from 'src/components/AdminLayout/AdminLayout'

import SkillAssessmentsComponent from '../AdminPanelPage/SkillAssessmentsComponent'

const AdminSkillAssessment = () => {
  return (
    <AdminLayout>
      <SkillAssessmentsComponent />
    </AdminLayout>
  )
}

export default AdminSkillAssessment
