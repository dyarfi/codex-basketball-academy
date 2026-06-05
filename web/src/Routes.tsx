import type { ReactNode } from 'react'

import { Router, Route, PrivateSet, Set } from '@redwoodjs/router'

import RequireRole from 'src/components/RequireRole/RequireRole'
import AdminAnnouncementPage from 'src/pages/AdminAnnouncementPage/AdminAnnouncementPage'
import AdminAttendancePage from 'src/pages/AdminAttendancePage/AdminAttendancePage'
import AdminCertificatesPage from 'src/pages/AdminCertificatesPage/AdminCertificatesPage'
import AdminClassesPage from 'src/pages/AdminClassesPage/AdminClassesPage'
import AdminDashboardPage from 'src/pages/AdminDashboardPage/AdminDashboardPage'
import AdminEnrollmentsPage from 'src/pages/AdminEnrollmentsPage/AdminEnrollmentsPage'
import AdminGalleriesPage from 'src/pages/AdminGalleriesPage/AdminGalleriesPage'
import AdminInvitationLinksPage from 'src/pages/AdminInvitationLinksPage/AdminInvitationLinksPage'
import AdminMediaPage from 'src/pages/AdminMediaPage/AdminMediaPage'
import AdminMessagesPage from 'src/pages/AdminMessagesPage/AdminMessagesPage'
import AdminPaymentsPage from 'src/pages/AdminPaymentsPage/AdminPaymentsPage'
import AdminPlayerStatsPage from 'src/pages/AdminPlayerStatsPage/AdminPlayerStatsPage'
import AdminProgramsPage from 'src/pages/AdminProgramsPage/AdminProgramsPage'
import AdminReportsPage from 'src/pages/AdminReportsPage/AdminReportsPage'
import AdminSettingsPage from 'src/pages/AdminSettingsPage/AdminSettingsPage'
import AdminSkillAssessment from 'src/pages/AdminSkillAssessment/AdminSkillAssessment'
import AdminUsersPage from 'src/pages/AdminUsersPage/AdminUsersPage'
import CoachPage from 'src/pages/CoachPage/CoachPage'
import DashboardPage from 'src/pages/DashboardPage/DashboardPage'
import EnrollmentPage from 'src/pages/EnrollmentPage/EnrollmentPage'
import ForgotPasswordPage from 'src/pages/ForgotPasswordPage/ForgotPasswordPage'
import GalleryPage from 'src/pages/GalleryPage/GalleryPage'
import HomePage from 'src/pages/HomePage/HomePage'
import InvitePage from 'src/pages/InvitePage/InvitePage'
import LoginPage from 'src/pages/LoginPage/LoginPage'
import LogoutPage from 'src/pages/LogoutPage'
import NotFoundPage from 'src/pages/NotFoundPage/NotFoundPage'
import ProgramDetailsPage from 'src/pages/ProgramDetailsPage/ProgramDetailsPage'
import ProgramsListPage from 'src/pages/ProgramsListPage/ProgramsListPage'
import ResetPasswordPage from 'src/pages/ResetPasswordPage/ResetPasswordPage'
import SignupPage from 'src/pages/SignupPage/SignupPage'
import UserProfilePage from 'src/pages/UserProfilePage/UserProfilePage'
import VerifyCertificatePage from 'src/pages/VerifyCertificatePage/VerifyCertificatePage'

import { AuthProvider, useAuth } from './auth'

const AuthAdminPanel = ({ children }: { children: ReactNode }) => (
  <AuthProvider>
    <main id="auth">{children}</main>
  </AuthProvider>
)

const AdminSet = ({ children }: { children: ReactNode }) => <RequireRole roles="ADMIN">{children}</RequireRole>

const CoachSet = ({ children }: { children: ReactNode }) => <RequireRole roles="COACH">{children}</RequireRole>

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Set wrap={AuthAdminPanel} useAuth={useAuth}>
        <Route path="/login" page={LoginPage} name="login" />
        <Route path="/signup" page={SignupPage} name="signup" />
        <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
        <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
        <Route path="/enrollment" page={EnrollmentPage} name="EnrollmentPage" />
        <Route path="/gallery" page={GalleryPage} name="GalleryPage" />
        <Route path="/programs" page={ProgramsListPage} name="ProgramsListPage" />
        <Route path="/programs/{id}" page={ProgramDetailsPage} name="ProgramsDetailPage" />
        <Route path="/invite/{code}" page={InvitePage} name="InvitePage" />
        <Route path="/verify-certificate/{code}" page={VerifyCertificatePage} name="verifyCertificate" />
        <Route path="/" page={HomePage} name="home" />

        <PrivateSet unauthenticated="login">
          <Route path="/auth/logout" page={LogoutPage} name="logout" />
          <Route path="/dashboard" page={DashboardPage} name="dashboard" />
          <Route path="/profile" page={UserProfilePage} name="UserProfile" />

          <Set wrap={AdminSet}>
            <Route path="/admin-panel" page={AdminDashboardPage} name="adminPanel" />
            <Route path="/admin-panel/users" page={AdminUsersPage} name="adminUsers" />
            <Route path="/admin-panel/programs" page={AdminProgramsPage} name="programs" />
            <Route path="/admin-panel/classes" page={AdminClassesPage} name="adminClasses" />
            <Route path="/admin-panel/enrollments" page={AdminEnrollmentsPage} name="adminEnrollments" />
            <Route path="/admin-panel/payments" page={AdminPaymentsPage} name="adminPayments" />
            <Route path="/admin-panel/announcements" page={AdminAnnouncementPage} name="adminAnnouncements" />
            <Route path="/admin-panel/attendances" page={AdminAttendancePage} name="adminAttendances" />
            <Route path="/admin-panel/certificates" page={AdminCertificatesPage} name="adminCertificates" />
            <Route path="/admin-panel/galleries" page={AdminGalleriesPage} name="adminGalleries" />
            <Route path="/admin-panel/medias" page={AdminMediaPage} name="adminMedias" />
            <Route path="/admin-panel/invitation-links" page={AdminInvitationLinksPage} name="adminInvitationLinks" />
            <Route path="/admin-panel/skill-assessment" page={AdminSkillAssessment} name="adminSkillAssessment" />
            <Route path="/admin-panel/player-stats" page={AdminPlayerStatsPage} name="adminPlayerStats" />
            <Route path="/admin-panel/messages" page={AdminMessagesPage} name="adminMessages" />
            <Route path="/admin-panel/reports" page={AdminReportsPage} name="adminReports" />
            <Route path="/admin-panel/settings" page={AdminSettingsPage} name="adminSettings" />
          </Set>

          <Set wrap={CoachSet}>
            <Route path="/coach-page" page={CoachPage} name="CoachPage" />
          </Set>
        </PrivateSet>
      </Set>
      <Route page={NotFoundPage} notfound />
    </Router>
  )
}

export default Routes
