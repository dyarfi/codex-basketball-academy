import React, { Profiler, ReactNode } from 'react'

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
  IconDashboard,
  IconUsers,
  IconPackage,
  IconNotebook,
  IconCash,
  IconFileText,
  IconLogout,
} from '@tabler/icons-react'

import { navigate, useLocation, routes, Link } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

interface AdminLayoutProps {
  children: ReactNode
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // const navigate = navigate();
  const location = useLocation()
  const { currentUser, loading: isLoading, logOut, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="sm" />
      </div>
    )
  }

  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Access Denied
          </h1>
          <p className="mb-4 text-gray-600">
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

  const handleLogout = () => {
    if (isAuthenticated) {
      logOut()
    }
    return navigate(routes.login(), { replace: true })
  }

  const navItems = [
    {
      label: 'Dashboard',
      icon: <IconDashboard size={16} />,
      href: '/admin-panel',
    },
    {
      label: 'Users Management',
      icon: <IconUsers size={16} />,
      href: '/admin-panel/users',
    },
    {
      label: 'Programs Management',
      icon: <IconPackage size={16} />,
      href: '/admin-panel/programs',
    },
    {
      label: 'Classes Management',
      icon: <IconNotebook size={16} />,
      href: '/admin-panel/classes',
    },
    {
      label: 'Payments & Invoices',
      icon: <IconCash size={16} />,
      href: '/admin-panel/payments',
    },
    {
      label: 'Reports',
      icon: <IconFileText size={16} />,
      href: '/admin-panel/reports',
    },
  ]

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + '/')

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
      <AppShell.Navbar
        p="md"
        className="bg-gradient-to-b from-slate-900 to-slate-800"
      >
        <div className="mb-4">
          <Text size="lg" fw={700} className="mb-1 text-white">
            Basketball Academy
          </Text>
          <Text size="xs" className="text-slate-400">
            Admin Dashboard
          </Text>
        </div>

        <AppShell.Section grow>
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                label={item.label}
                icon={item.icon}
                active={isActive(item.href)}
                onClick={() => navigate(item.href)}
                className={`cursor-pointer ${
                  isActive(item.href)
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
              />
            ))}
          </div>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Header
        p="xs"
        pl={'lg'}
        className="border-b border-gray-200 bg-white"
      >
        <Group justify="space-between" h="100%">
          <div className="flex items-center gap-3">
            <Text fw={600} size="lg">
              Basketball Academy Admin
            </Text>
          </div>

          <Group gap="lg">
            <Text size="sm" className="text-gray-600">
              {currentUser?.profile.firstName}
            </Text>
            <Menu position="bottom-end" shadow="md">
              <Menu.Target>
                <Avatar
                  name={currentUser?.email || 'Admin'}
                  color="blue"
                  radius="xl"
                  className="cursor-pointer"
                />
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item>
                  <Link to="/profile">
                    <Text size="sm" fw={500}>
                      {currentUser?.email}
                    </Text>
                  </Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconLogout size={14} />}
                  onClick={handleLogout}
                  color="red"
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main className="bg-gray-50">{children}</AppShell.Main>
    </AppShell>
  )
}

export default AdminLayout
