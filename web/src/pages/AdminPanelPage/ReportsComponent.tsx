import React, { useMemo } from 'react'

import {
  Container,
  Grid,
  Card,
  Text,
  Group,
  Stack,
  Alert,
  Loader,
  Button,
  Badge,
} from '@mantine/core'
import { DownloadSimple, WarningCircle } from '@phosphor-icons/react'
import gql from 'graphql-tag'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { GetReportData } from 'types/graphql'

import { useQuery } from '@redwoodjs/web'

import { useAppTheme } from 'src/providers/ThemeProvider'

const GET_REPORT_DATA = gql`
  query GetReportData {
    users {
      id
      role
      createdAt
    }
    programs {
      id
      name
      pricePerMonth
      isActive
    }
    enrollments {
      id
      enrollmentDate
      program {
        name
      }
    }
    payments {
      id
      amount
      status
      createdAt
    }
    classes {
      id
      program {
        name
      }
      enrollments {
        id
      }
    }
  }
`

interface ReportData {
  users: Array<{ id: string; role: string; createdAt: string }>
  programs: Array<{
    id: string
    name: string
    pricePerMonth: number
    isActive: boolean
  }>
  enrollments: Array<{
    id: string
    enrollmentDate: string
    program: { name: string }
  }>
  payments: Array<{
    id: string
    amount: number
    status: string
    createdAt: string
  }>
  classes: Array<{
    id: string
    program: { name: string }
    enrollments: Array<{ id: string }>
  }>
}

const ReportsPage = () => {
  const { data, loading, error } = useQuery<{ GetReportData: ReportData }>(
    GET_REPORT_DATA
  )
  const { isDark } = useAppTheme()
  const cardClass = isDark
    ? 'border border-slate-800 bg-slate-900 text-slate-100'
    : 'border border-gray-200 bg-white text-gray-900'
  const mutedClass = isDark ? 'text-slate-400' : 'text-gray-600'
  const mutedSoftClass = isDark ? 'text-slate-500' : 'text-gray-500'
  const chartGridColor = isDark ? '#334155' : '#d1d5db'
  const chartAxisColor = isDark ? '#cbd5e1' : '#475569'
  const chartPrimary = isDark ? '#60a5fa' : '#0088FE'

  // const reportData = data?.GetReportData
  const reportData = data

  // Process enrollment trends data
  const enrollmentTrends = useMemo(() => {
    if (!reportData?.enrollments) return []

    const byMonth: { [key: string]: number } = {}
    reportData.enrollments.forEach((enrollment) => {
      const date = new Date(enrollment.enrollmentDate)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      byMonth[monthKey] = (byMonth[monthKey] || 0) + 1
    })

    return Object.entries(byMonth)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([month, count]) => ({
        month,
        enrollments: count,
      }))
  }, [reportData])

  // Process revenue by status
  const revenueByStatus = useMemo(() => {
    if (!reportData?.payments) return []

    const byStatus: { [key: string]: number } = {}
    reportData.payments.forEach((payment) => {
      byStatus[payment.status] =
        (byStatus[payment.status] || 0) + payment.amount
    })

    return Object.entries(byStatus).map(([status, amount]) => ({
      name: status,
      value: Math.round(amount * 100) / 100,
    }))
  }, [reportData])

  // Process top programs
  const topPrograms = useMemo(() => {
    if (!reportData?.classes) return []

    const programStats: {
      [key: string]: { enrollment: number; revenue: number }
    } = {}

    reportData.classes.forEach((cls) => {
      const programName = cls.program.name
      if (!programStats[programName]) {
        programStats[programName] = { enrollment: 0, revenue: 0 }
      }
      programStats[programName].enrollment += cls.enrollments.length
    })

    // Add revenue from programs
    reportData.programs.forEach((program) => {
      if (programStats[program.name]) {
        programStats[program.name].revenue =
          Math.round(program.pricePerMonth * 100) / 100
      }
    })

    return Object.entries(programStats)
      .map(([name, stats]) => ({
        name,
        ...stats,
      }))
      .sort((a, b) => b.enrollment - a.enrollment)
      .slice(0, 5)
  }, [reportData])

  // User statistics
  const userStats = useMemo(() => {
    if (!reportData?.users) return {}

    const roles: { [key: string]: number } = {}
    reportData.users.forEach((user) => {
      roles[user.role] = (roles[user.role] || 0) + 1
    })

    return roles
  }, [reportData])

  // Payment statistics
  const paymentStats = useMemo(() => {
    if (!reportData?.payments)
      return { total: 0, completed: 0, pending: 0, failed: 0 }

    const stats = { total: 0, completed: 0, pending: 0, failed: 0 }
    reportData.payments.forEach((payment) => {
      stats.total += payment.amount
      if (payment.status === 'COMPLETED') stats.completed += payment.amount
      if (payment.status === 'PENDING') stats.pending += payment.amount
      if (payment.status === 'FAILED') stats.failed += payment.amount
    })

    return stats
  }, [reportData])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  const handleExportData = () => {
    alert(
      'Export functionality would be implemented here with CSV/PDF generation'
    )
  }

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <div className="flex min-h-96 items-center justify-center">
          <Loader size="sm" />
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert
          icon={<WarningCircle size={16} weight="bold" />}
          title="Error"
          color="red"
          className="mb-6"
        >
          Failed to load reports: {error.message}
        </Alert>
      </Container>
    )
  }

  console.log({ data, reportData })

  return (
    <Container
      size="xl"
      py={{ base: 'sm', sm: 'md', md: 'xl' }}
      px={{ base: 'xs', sm: 'md' }}
    >
      <Group justify="space-between" mb="lg" grow={true} align="flex-start">
        <Text size="lg" fw={700}>
          Reports & Analytics
        </Text>
        <Button
          leftSection={<DownloadSimple size={16} weight="bold" />}
          onClick={handleExportData}
          variant="light"
        >
          Export Data
        </Button>
      </Group>

      {/* Key Metrics */}
      <Grid gutter={{ base: 'xs', sm: 'md' }} mb="xl">
        <Grid.Col span={{ base: 12, xs: 6, sm: 6, md: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" className={cardClass}>
            <Stack gap="xs">
              <Text size="sm" className={mutedClass}>
                Total Revenue
              </Text>
              <Text size="xl" fw={700}>
                ${paymentStats.total.toFixed(2)}
              </Text>
              <Badge color="green" variant="light">
                {reportData?.payments?.length || 0} transactions
              </Badge>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, xs: 6, sm: 6, md: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" className={cardClass}>
            <Stack gap="xs">
              <Text size="sm" className={mutedClass}>
                Completed Payments
              </Text>
              <Text size="xl" fw={700}>
                ${paymentStats.completed.toFixed(2)}
              </Text>
              <Badge color="blue" variant="light">
                Verified
              </Badge>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, xs: 6, sm: 6, md: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" className={cardClass}>
            <Stack gap="xs">
              <Text size="sm" className={mutedClass}>
                Pending Payments
              </Text>
              <Text size="xl" fw={700}>
                ${paymentStats.pending.toFixed(2)}
              </Text>
              <Badge color="yellow" variant="light">
                {reportData?.payments?.filter((p) => p.status === 'PENDING')
                  .length || 0}{' '}
                items
              </Badge>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" className={cardClass}>
            <Stack gap="xs">
              <Text size="sm" className={mutedClass}>
                Total Users
              </Text>
              <Text size="xl" fw={700}>
                {reportData?.users?.length || 0}
              </Text>
              <Badge color="purple" variant="light">
                Active accounts
              </Badge>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Charts */}
      <Grid gutter="md" mb="xl">
        {/* Enrollment Trends */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" className={cardClass}>
            <Text fw={600} mb="md">
              Enrollment Trends
            </Text>
            {enrollmentTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={enrollmentTrends}>
                  <CartesianGrid
                    stroke={chartGridColor}
                    strokeDasharray="3 3"
                  />
                  <XAxis dataKey="month" stroke={chartAxisColor} />
                  <YAxis stroke={chartAxisColor} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="enrollments"
                    stroke={chartPrimary}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Text size="sm" className={mutedClass}>
                No enrollment data available
              </Text>
            )}
          </Card>
        </Grid.Col>

        {/* Revenue by Status */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" className={cardClass}>
            <Text fw={600} mb="md">
              Revenue Breakdown
            </Text>
            {revenueByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: $${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueByStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Text size="sm" className={mutedClass}>
                No payment data available
              </Text>
            )}
          </Card>
        </Grid.Col>
      </Grid>

      <Grid gutter="md" mb="xl">
        {/* Top Performing Programs */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" className={cardClass}>
            <Text fw={600} mb="md">
              Top Performing Programs
            </Text>
            {topPrograms.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topPrograms}>
                  <CartesianGrid
                    stroke={chartGridColor}
                    strokeDasharray="3 3"
                  />
                  <XAxis dataKey="name" stroke={chartAxisColor} />
                  <YAxis stroke={chartAxisColor} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="enrollment" fill="#8884d8" name="Enrollments" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Text size="sm" className={mutedClass}>
                No program data available
              </Text>
            )}
          </Card>
        </Grid.Col>

        {/* User Distribution */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" className={cardClass}>
            <Text fw={600} mb="md">
              User Distribution by Role
            </Text>
            <Stack gap="sm">
              {Object.entries(userStats).map(([role, count], index) => (
                <Group key={role} justify="space-between">
                  <Badge color={COLORS[index % COLORS.length]} variant="light">
                    {role}
                  </Badge>
                  <Text fw={500}>{count} users</Text>
                </Group>
              ))}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Summary Stats */}
      <Card shadow="sm" padding="lg" radius="md" className={cardClass}>
        <Text fw={600} mb="md">
          Summary Statistics
        </Text>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Stack gap="xs">
              <Text size="sm" className={mutedClass}>
                Total Programs
              </Text>
              <Text size="lg" fw={700}>
                {reportData?.programs?.length || 0}
              </Text>
              <Text size="xs" className={mutedSoftClass}>
                {reportData?.programs?.filter((p) => p.isActive).length || 0}{' '}
                active
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Stack gap="xs">
              <Text size="sm" className={mutedClass}>
                Total Enrollments
              </Text>
              <Text size="lg" fw={700}>
                {reportData?.enrollments?.length || 0}
              </Text>
              <Text size="xs" className={mutedSoftClass}>
                Across all programs
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Stack gap="xs">
              <Text size="sm" className={mutedClass}>
                Total Classes
              </Text>
              <Text size="lg" fw={700}>
                {reportData?.classes?.length || 0}
              </Text>
              <Text size="xs" className={mutedSoftClass}>
                Active classes
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Stack gap="xs">
              <Text size="sm" className={mutedClass}>
                Payment Success Rate
              </Text>
              <Text size="lg" fw={700}>
                {reportData?.payments && reportData.payments.length > 0
                  ? Math.round(
                      (reportData.payments.filter(
                        (p) => p.status === 'COMPLETED'
                      ).length /
                        reportData.payments.length) *
                        100
                    )
                  : 0}
                %
              </Text>
              <Text size="xs" className={mutedSoftClass}>
                Completed transactions
              </Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  )
}

export default ReportsPage
