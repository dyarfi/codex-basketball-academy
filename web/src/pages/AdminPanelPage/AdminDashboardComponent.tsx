import React from 'react'

import {
  Container,
  Grid,
  Card,
  Group,
  Text,
  Badge,
  RingProgress,
  Stack,
  Loader,
  Alert,
} from '@mantine/core'
import {
  IconUsers,
  IconPackage,
  IconNotebook,
  IconCash,
  IconAlertCircle,
} from '@tabler/icons-react'

import { useQuery } from '@redwoodjs/web'

import AdminLayout from 'src/components/AdminLayout/AdminLayout'

const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    users {
      id
      role
      isActive
    }
    programs {
      id
      isActive
    }
    classes {
      id
      isActive
    }
    payments {
      id
      status
      amount
    }
    invoices {
      id
      status
      amount
    }
    enrollments {
      id
      user {
        email
      }
      program {
        name
      }
      enrollmentDate
    }
  }
`

interface DashboardStats {
  users: Array<{ id: string; role: string; isActive: boolean }>
  programs: Array<{ id: string; isActive: boolean }>
  classes: Array<{ id: string; isActive: boolean }>
  payments: Array<{ id: string; status: string; amount: number }>
  invoices: Array<{ id: string; status: string; amount: number }>
  enrollments: Array<{
    id: string
    user: { email: string }
    program: { name: string }
    enrollmentDate: string
  }>
}

const AdminDashboardPage = () => {
  const { data, loading, error } = useQuery<{
    GetDashboardStats: DashboardStats
  }>(GET_DASHBOARD_STATS)

  console.log({ data, loading, error })
  if (loading) {
    return (
      <AdminLayout>
        <Container size="xl" py="xl">
          <div className="flex min-h-96 items-center justify-center">
            <Loader size="sm" />
          </div>
        </Container>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <Container size="xl" py="xl">
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            className="mb-6"
          >
            Failed to load dashboard statistics: {error.message}
          </Alert>
        </Container>
      </AdminLayout>
    )
  }

  const stats: DashboardStats | undefined = data

  if (!stats) {
    return (
      <AdminLayout>
        <Container size="xl" py="xl">
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="No Data"
            color="yellow"
            className="mb-6"
          >
            No dashboard data available
          </Alert>
        </Container>
      </AdminLayout>
    )
  }

  // Calculate statistics
  const totalUsers = stats?.users.length
  const activeUsers = stats?.users.filter((u) => u.isActive).length
  const admins = stats?.users.filter((u) => u.role === 'ADMIN').length
  const coaches = stats?.users.filter((u) => u.role === 'COACH').length
  const players = stats?.users.filter((u) => u.role === 'PLAYER').length
  const parents = stats?.users.filter((u) => u.role === 'PARENT').length

  const activePrograms = stats?.programs.filter((p) => p.isActive).length
  const totalPrograms = stats?.programs.length

  const activeClasses = stats?.classes.filter((c) => c.isActive).length
  const totalClasses = stats?.classes.length

  const completedPayments = stats?.payments.filter(
    (p) => p.status === 'COMPLETED'
  ).length
  const totalPaymentsAmount = stats?.payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingInvoices = stats?.invoices.filter(
    (i) => i.status === 'PENDING'
  ).length
  const totalInvoicesAmount = stats?.invoices.reduce(
    (sum, i) => sum + i.amount,
    0
  )

  // Get last 5 enrollments (sorted by date)
  const recentEnrollments = (stats?.enrollments ?? [])
    .slice() // clone
    .sort(
      (a, b) =>
        new Date(b.enrollmentDate).getTime() -
        new Date(a.enrollmentDate).getTime()
    )
    .slice(0, 5)

  return (
    <AdminLayout>
      <Container size="xl" py="xl">
        <Text size="xl" fw={700} mb="lg">
          Dashboard Overview
        </Text>

        {/* Stats Grid */}
        <Grid gutter="md" mb="xl">
          {/* Users Card */}
          <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              className="border border-gray-200"
            >
              <Group justify="space-between" mb="md">
                <Text fw={500} size="sm">
                  Total Users
                </Text>
                <IconUsers size={24} className="text-blue-500" />
              </Group>
              <Text size="xl" fw={700}>
                {totalUsers}
              </Text>
              <Text size="xs" className="mt-1 text-gray-600">
                {activeUsers} active
              </Text>
            </Card>
          </Grid.Col>

          {/* Programs Card */}
          <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              className="border border-gray-200"
            >
              <Group justify="space-between" mb="md">
                <Text fw={500} size="sm">
                  Programs
                </Text>
                <IconPackage size={24} className="text-green-500" />
              </Group>
              <Text size="xl" fw={700}>
                {activePrograms}
              </Text>
              <Text size="xs" className="mt-1 text-gray-600">
                {totalPrograms} total
              </Text>
            </Card>
          </Grid.Col>

          {/* Classes Card */}
          <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              className="border border-gray-200"
            >
              <Group justify="space-between" mb="md">
                <Text fw={500} size="sm">
                  Classes
                </Text>
                <IconNotebook size={24} className="text-purple-500" />
              </Group>
              <Text size="xl" fw={700}>
                {activeClasses}
              </Text>
              <Text size="xs" className="mt-1 text-gray-600">
                {totalClasses} total
              </Text>
            </Card>
          </Grid.Col>

          {/* Revenue Card */}
          <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              className="border border-gray-200"
            >
              <Group justify="space-between" mb="md">
                <Text fw={500} size="sm">
                  Revenue
                </Text>
                <IconCash size={24} className="text-yellow-500" />
              </Group>
              <Text size="xl" fw={700}>
                ${totalPaymentsAmount.toFixed(2)}
              </Text>
              <Text size="xs" className="mt-1 text-gray-600">
                {completedPayments} completed
              </Text>
            </Card>
          </Grid.Col>

          {/* Pending Invoices Card */}
          <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              className="border border-orange-200"
            >
              <Group justify="space-between" mb="md">
                <Text fw={500} size="sm">
                  Pending
                </Text>
                <Badge color="orange" size="lg">
                  !
                </Badge>
              </Group>
              <Text size="xl" fw={700}>
                {pendingInvoices}
              </Text>
              <Text size="xs" className="mt-1 text-gray-600">
                invoices pending
              </Text>
            </Card>
          </Grid.Col>

          {/* Total Revenue Card */}
          <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              className="border border-gray-200"
            >
              <Group justify="space-between" mb="md">
                <Text fw={500} size="sm">
                  Total Due
                </Text>
                <Badge color="blue">${totalInvoicesAmount.toFixed(0)}</Badge>
              </Group>
              <Text size="xs" className="mt-2 text-gray-600">
                from {stats.invoices.length} invoices
              </Text>
            </Card>
          </Grid.Col>
        </Grid>

        {/* User Breakdown */}
        <Grid gutter="md" mb="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              className="border border-gray-200"
            >
              <Text fw={600} mb="md">
                User Breakdown
              </Text>
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text size="sm">Admins</Text>
                  <Badge color="red">{admins}</Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Coaches</Text>
                  <Badge color="blue">{coaches}</Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Players</Text>
                  <Badge color="green">{players}</Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Parents</Text>
                  <Badge color="purple">{parents}</Badge>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>

          {/* Recent Enrollments */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              className="border border-gray-200"
            >
              <Text fw={600} mb="md">
                Recent Enrollments
              </Text>
              <Stack gap="md">
                {recentEnrollments.length > 0 ? (
                  recentEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="border-b pb-2">
                      <Group justify="space-between">
                        <div>
                          <Text size="sm" fw={500}>
                            {enrollment.user.email}
                          </Text>
                          <Text size="xs" className="text-gray-600">
                            {enrollment.program.name}
                          </Text>
                        </div>
                        <Text size="xs" className="text-gray-600">
                          {new Date(
                            enrollment.enrollmentDate
                          ).toLocaleDateString()}
                        </Text>
                      </Group>
                    </div>
                  ))
                ) : (
                  <Text size="sm" className="text-gray-600">
                    No recent enrollments
                  </Text>
                )}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </AdminLayout>
  )
}

export default AdminDashboardPage
