import React, { ReactNode } from 'react'

import {
  AppShell,
  Group,
  Avatar,
  Menu,
  Text,
  NavLink,
  Loader,
} from '@mantine/core'
import {
  Books,
  ChartLineUp,
  CalendarDots,
  House,
  Receipt,
  SignOut,
  Users,
  IdentificationCard,
  GearSix,
  SpeakerHifiIcon,
  ChatCircleIcon,
} from '@phosphor-icons/react'

import { navigate, useLocation, routes, Link } from '@redwoodjs/router'
import { useRoutePath } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import ThemeToggle from 'src/components/ThemeToggle/ThemeToggle'
import { useSettings } from 'src/providers/SettingsProvider'
import { useAppTheme } from 'src/providers/ThemeProvider'

interface AdminLayoutProps {
  children: ReactNode
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // const navigate = navigate();
  const routePath = useRoutePath()

  const location = useLocation()
  const { currentUser, loading: isLoading, logOut, isAuthenticated } = useAuth()
  const { isDark } = useAppTheme()
  const { getSetting, loading: settingsLoading } = useSettings()

  const siteName = getSetting('site_name', 'Basketball Academy')
  const headerSubtitle = getSetting('header_subtitle', 'Admin Dashboard')

  const user = currentUser as {
    email?: string
    role?: string
    profile?: {
      firstName?: string
      lastName?: string
    }
  } | null

  const surfaceClass = isDark
    ? 'border-slate-800 bg-slate-950 text-slate-100'
    : 'border-slate-200 bg-white text-slate-900'
  const panelClass = isDark
    ? 'border-slate-800 bg-slate-900'
    : 'border-slate-200 bg-slate-50'
  const textMutedClass = isDark ? 'text-slate-400' : 'text-slate-500'

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="sm" />
      </div>
    )
  }

  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Access Denied
          </h1>
          <p className={`mb-4 ${textMutedClass}`}>
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // const handleLogout = () => {
  //   if (isAuthenticated) {
  //     logOut()
  //   }
  //   return navigate(routes.login(), { replace: true })
  // }

  const navItems = [
    {
      label: 'Dashboard',
      icon: <House size={16} weight="bold" />,
      href: '/admin-panel',
    },
    {
      label: 'Users Management',
      icon: <Users size={16} weight="bold" />,
      href: '/admin-panel/users',
    },
    {
      label: 'Programs Management',
      icon: <Books size={16} weight="bold" />,
      href: '/admin-panel/programs',
    },
    {
      label: 'Classes Management',
      icon: <CalendarDots size={16} weight="bold" />,
      href: '/admin-panel/classes',
    },
    {
      label: 'Enrollments Management',
      icon: <IdentificationCard size={16} weight="bold" />,
      href: '/admin-panel/enrollments',
    },
    {
      label: 'Payments & Invoices',
      icon: <Receipt size={16} weight="bold" />,
      href: '/admin-panel/payments',
    },
    {
      label: 'Announcements',
      icon: <SpeakerHifiIcon size={16} weight="bold" />,
      href: '/admin-panel/announcements',
    },
    {
      label: 'Messages',
      icon: <ChatCircleIcon size={16} weight="bold" />,
      href: '/admin-panel/messages',
    },
    {
      label: 'Attendance',
      icon: <CalendarDots size={16} weight="bold" />,
      href: '/admin-panel/attendances',
    },
    {
      label: 'Reports',
      icon: <ChartLineUp size={16} weight="bold" />,
      href: '/admin-panel/reports',
    },
    {
      label: 'Settings',
      icon: <GearSix size={16} weight="bold" />,
      href: '/admin-panel/settings',
    },
  ]

  const isActive = (href: string) =>
    href !== '/admin-panel' && routePath?.startsWith(href)

  return (
    <AppShell
      layout="alt"
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: false },
      }}
      header={{ height: 60 }}
    >
      <AppShell.Navbar p="md" className={`${surfaceClass} border-r`}>
        <div className="mb-4">
          <Text size="lg" fw={700} className="mb-1">
            {siteName}
          </Text>
          <Text size="xs" className={textMutedClass}>
            {headerSubtitle}
          </Text>
        </div>

        <AppShell.Section grow>
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                label={item.label}
                leftSection={item.icon}
                active={isActive(item.href)}
                onClick={() => navigate(item.href)}
                style={{
                  borderRadius: '0.5rem',
                  color: isActive(item.href)
                    ? isDark
                      ? '#93c5fd'
                      : '#1d4ed8'
                    : isDark
                      ? '#cbd5e1'
                      : '#475569',
                  backgroundColor: isActive(item.href)
                    ? isDark
                      ? 'rgba(59, 130, 246, 0.2)'
                      : '#eff6ff'
                    : 'transparent',
                }}
              />
            ))}
          </div>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Header p="xs" pl={'lg'} className={`${surfaceClass} border-b`}>
        <Group justify="space-between" h="100%">
          <div className="flex items-center gap-3">
            <Text fw={600} size="lg">
              {siteName} Admin
            </Text>
          </div>

          <Group gap="lg">
            <ThemeToggle />
            <Text size="sm" className={textMutedClass}>
              {user?.profile?.firstName}
            </Text>
            <Menu position="bottom-end" shadow="md">
              <Menu.Target>
                <Avatar
                  name={user?.email || 'Admin'}
                  color={isDark ? 'cyan' : 'blue'}
                  radius="xl"
                  className="cursor-pointer"
                />
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item>
                  <Link to="/profile">
                    <Text size="sm" fw={500}>
                      {user?.email}
                    </Text>
                  </Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<SignOut size={14} weight="bold" />}
                  color="red"
                >
                  <Link to="/auth/logout">Logout</Link>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main className={panelClass}>{children}</AppShell.Main>
    </AppShell>
  )
}

export default AdminLayout
