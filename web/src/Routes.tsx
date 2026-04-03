import { Router, Route, PrivateSet } from '@redwoodjs/router'
import { RoleRoute } from 'src/components/RoleRoute'

import LoginPage from 'src/pages/LoginPage/LoginPage'
import SignupPage from 'src/pages/SignupPage/SignupPage'
import ForgotPasswordPage from 'src/pages/ForgotPasswordPage/ForgotPasswordPage'
import ResetPasswordPage from 'src/pages/ResetPasswordPage/ResetPasswordPage'
import HomePage from 'src/pages/HomePage/HomePage'
import DashboardPage from 'src/pages/DashboardPage/DashboardPage'
import AdminPanelPage from 'src/pages/AdminPanelPage/AdminPanelPage'
import CoachPage from 'src/pages/CoachPage/CoachPage'

const Routes = () => {
  return (
    <Router>
      <Route path="/login" page={LoginPage} name="login" />
      <Route path="/signup" page={SignupPage} name="signup" />
      <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
      <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
      <Route path="/" page={HomePage} name="home" />

      <PrivateSet unauthenticated="login">
        <Route path="/dashboard" page={DashboardPage} name="dashboard" />

        <RoleRoute requiredRoles="ADMIN">
          <Route path="/admin-panel" page={AdminPanelPage} name="adminPanel" />
        </RoleRoute>

        <RoleRoute requiredRoles="COACH">
          <Route path="/coach-page" page={CoachPage} name="coach" />
        </RoleRoute>
      </PrivateSet>

      <Route notFoundPage={LoginPage} />
    </Router>
  )
}

export default Routes
