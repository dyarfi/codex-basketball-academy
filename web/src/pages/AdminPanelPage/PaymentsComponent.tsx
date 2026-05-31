import React, { useState } from 'react'

import {
  Container,
  Table,
  Group,
  Badge,
  TextInput,
  Select,
  Modal,
  Text,
  Stack,
  Alert,
  Loader,
  Tabs,
  Tooltip,
  ActionIcon,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import {
  IconSearch,
  IconAlertCircle,
  IconEye,
  IconCash,
  IconFileText,
} from '@tabler/icons-react'

import { routes, useParams } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import AdminLayout from 'src/components/AdminLayout/AdminLayout'
import AdminPagination from 'src/components/AdminPagination/AdminPagination'
import {
  GET_PAGINATED_INVOICES,
  GET_PAGINATED_PAYMENTS,
} from 'src/graphql/payments-queries'

interface Payment {
  id: string
  userId: string
  user: {
    email: string
    profile?: {
      firstName: string
      lastName: string
    }
  }
  amount: number
  currency: string
  status: string
  description?: string
  createdAt: string
}

interface Invoice {
  id: string
  userId: string
  user: {
    email: string
    profile?: {
      firstName: string
      lastName: string
    }
  }
  invoiceNumber: string
  amount: number
  dueDate: string
  paidDate?: string
  status: string
  description?: string
  createdAt: string
}

const getPageFromParam = (value: unknown) => {
  const parsedPage = Number(value)

  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
}

const PaymentsPage = () => {
  const PAGE_SIZE = 10
  const { page = 1, search, status } = useParams()
  const initialPage = getPageFromParam(page)
  const [activeTab, setActiveTab] = useState<string | null>('invoices')
  const [searchQuery, setSearchQuery] = useState(
    typeof search === 'string' ? search : ''
  )
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300)
  const [statusFilter, setStatusFilter] = useState<string | null>(
    typeof status === 'string' ? status : null
  )
  const [invoicePage, setInvoicePage] = useState(initialPage)
  const [paymentPage, setPaymentPage] = useState(initialPage)
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const variablesPayment = {
    page: paymentPage,
    pageSize: PAGE_SIZE,
    search: debouncedSearchQuery || undefined,
    status: statusFilter || undefined,
  }
  const paymentsQuery = useQuery<{
    paginatedPayments: {
      items: Payment[]
      totalCount: number
      totalPages: number
    }
  }>(GET_PAGINATED_PAYMENTS, {
    variables: variablesPayment,
    refetchQueries: [{ query: GET_PAGINATED_PAYMENTS }],
    awaitRefetchQueries: true,
  })
  const variablesInvoice = {
    page: invoicePage,
    pageSize: PAGE_SIZE,
    search: debouncedSearchQuery || undefined,
    status: statusFilter || undefined,
  }
  const invoicesQuery = useQuery<{
    paginatedInvoices: {
      items: Invoice[]
      totalCount: number
      totalPages: number
    }
  }>(GET_PAGINATED_INVOICES, {
    variables: variablesInvoice,
  })

  const payments = paymentsQuery.data?.paginatedPayments?.items || []
  const totalPayments = paymentsQuery.data?.paginatedPayments?.totalCount || 0
  const invoices = invoicesQuery.data?.paginatedInvoices?.items || []
  const totalInvoices = invoicesQuery.data?.paginatedInvoices?.totalCount || 0

  const totalInvoicePages =
    invoicesQuery.data?.paginatedInvoices?.totalPages ??
    Math.max(1, Math.ceil(totalInvoices / PAGE_SIZE))
  const totalPaymentPages =
    paymentsQuery.data?.paginatedPayments?.totalPages ??
    Math.max(1, Math.ceil(totalPayments / PAGE_SIZE))

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'yellow'
      case 'COMPLETED':
        return 'green'
      case 'FAILED':
        return 'red'
      case 'REFUNDED':
        return 'orange'
      case 'OVERDUE':
        return 'red'
      default:
        return 'gray'
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  if (
    (paymentsQuery.loading && !paymentsQuery.data) ||
    (invoicesQuery.loading && !invoicesQuery.data)
  ) {
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

  return (
    <AdminLayout>
      <Container size="xl" py={{ base: 'sm', sm: 'md', md: 'xl' }} px={{ base: 'xs', sm: 'md' }}>
        <Text size="xl" fw={700} mb="lg">
          Payments & Invoices
        </Text>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab leftSection={<IconFileText size={14} />} value="invoices">
              Invoices
            </Tabs.Tab>
            <Tabs.Tab leftSection={<IconCash size={14} />} value="payments">
              Payments
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="invoices">
            {/* Filters */}
            <Group
              gap="md"
              mb="lg"
              className="mt-4 rounded-lg border border-gray-200 bg-white p-4"
            >
              <TextInput
                placeholder="Search by invoice number or email"
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                className="flex-1"
              />

              <Select
                placeholder="Filter by status"
                data={[
                  { value: '', label: 'All Status' },
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'COMPLETED', label: 'Completed' },
                  { value: 'FAILED', label: 'Failed' },
                  { value: 'REFUNDED', label: 'Refunded' },
                ]}
                value={statusFilter || ''}
                onChange={(value) => setStatusFilter(value || null)}
              />
            </Group>

            <Text size="sm" className="mb-4 text-gray-600">
              Showing {invoices.length} of {totalInvoices} invoices
            </Text>

            {/* Invoices Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Invoice #</Table.Th>
                    <Table.Th>User</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Due Date</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {invoices.map((invoice) => {
                    const overdue =
                      isOverdue(invoice.dueDate) && invoice.status === 'PENDING'
                    return (
                      <Table.Tr
                        key={invoice.id}
                        className={overdue ? 'bg-red-50' : ''}
                      >
                        <Table.Td fw={500}>{invoice.invoiceNumber}</Table.Td>
                        <Table.Td>
                          {invoice.user.profile?.firstName}{' '}
                          {invoice.user.profile?.lastName}
                          <Text size="xs" className="text-gray-600">
                            {invoice.user.email}
                          </Text>
                        </Table.Td>
                        <Table.Td>${invoice.amount.toFixed(2)}</Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </Text>
                          {overdue && (
                            <Badge size="sm" color="red" variant="light">
                              Overdue
                            </Badge>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Badge color={getStatusColor(invoice.status)}>
                            {overdue ? 'OVERDUE' : invoice.status}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Tooltip label="View">
                              <ActionIcon
                                size="sm"
                                variant="light"
                                color="blue"
                                onClick={() => {
                                  setViewingInvoice(invoice)
                                  setShowViewModal(true)
                                }}
                              >
                                <IconEye size={14} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    )
                  })}
                </Table.Tbody>
              </Table>
            </div>

            <AdminPagination
              label="invoices"
              totalItems={totalInvoices}
              page={invoicePage}
              totalPages={totalInvoicePages}
              route={routes.adminPayments}
              query={{
                search: debouncedSearchQuery || undefined,
                status: statusFilter || undefined,
              }}
              onPageChange={setInvoicePage}
              pageSize={PAGE_SIZE}
            />
          </Tabs.Panel>

          <Tabs.Panel value="payments">
            {/* Filters */}
            <Group
              gap="md"
              mb="lg"
              className="mt-4 rounded-lg border border-gray-200 bg-white p-4"
            >
              <TextInput
                placeholder="Search by user email"
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                className="flex-1"
              />

              <Select
                placeholder="Filter by status"
                data={[
                  { value: '', label: 'All Status' },
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'COMPLETED', label: 'Completed' },
                  { value: 'FAILED', label: 'Failed' },
                  { value: 'REFUNDED', label: 'Refunded' },
                ]}
                value={statusFilter || ''}
                onChange={(value) => setStatusFilter(value || null)}
              />
            </Group>

            <Text size="sm" className="mb-4 text-gray-600">
              Showing {payments.length} of {totalPayments} payments
            </Text>

            {/* Payments Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Payment ID</Table.Th>
                    <Table.Th>User</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Currency</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {payments.map((payment) => (
                    <Table.Tr key={payment.id}>
                      <Table.Td fw={500} className="font-mono text-xs">
                        {payment.id.substring(0, 8)}...
                      </Table.Td>
                      <Table.Td>
                        {payment.user.profile?.firstName}{' '}
                        {payment.user.profile?.lastName}
                        <Text size="xs" className="text-gray-600">
                          {payment.user.email}
                        </Text>
                      </Table.Td>
                      <Table.Td>${payment.amount.toFixed(2)}</Table.Td>
                      <Table.Td>
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </Table.Td>
                      <Table.Td>
                        <Badge size="sm" variant="light">
                          {payment.currency}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(payment.status)} size="sm">
                          {payment.status}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>

            <AdminPagination
              label="payments"
              totalItems={totalPayments}
              page={paymentPage}
              totalPages={totalPaymentPages}
              route={routes.adminPayments}
              query={{
                search: debouncedSearchQuery || undefined,
                status: statusFilter || undefined,
              }}
              onPageChange={setPaymentPage}
              pageSize={PAGE_SIZE}
            />
          </Tabs.Panel>
        </Tabs>

        {/* View Invoice Modal */}
        <Modal
          opened={showViewModal}
          onClose={() => setShowViewModal(false)}
          title="Invoice Details"
        >
          {viewingInvoice && (
            <Stack gap="md">
              <div>
                <Text size="sm" fw={500} className="text-gray-600">
                  Invoice Number
                </Text>
                <Text>{viewingInvoice.invoiceNumber}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} className="text-gray-600">
                  User
                </Text>
                <Text>
                  {viewingInvoice.user.profile?.firstName}{' '}
                  {viewingInvoice.user.profile?.lastName}
                </Text>
                <Text size="sm" className="text-gray-600">
                  {viewingInvoice.user.email}
                </Text>
              </div>
              <div>
                <Text size="sm" fw={500} className="text-gray-600">
                  Amount
                </Text>
                <Text>${viewingInvoice.amount.toFixed(2)}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} className="text-gray-600">
                  Due Date
                </Text>
                <Text>
                  {new Date(viewingInvoice.dueDate).toLocaleDateString()}
                </Text>
              </div>
              {viewingInvoice.paidDate && (
                <div>
                  <Text size="sm" fw={500} className="text-gray-600">
                    Paid Date
                  </Text>
                  <Text>
                    {new Date(viewingInvoice.paidDate).toLocaleDateString()}
                  </Text>
                </div>
              )}
              <div>
                <Text size="sm" fw={500} className="text-gray-600">
                  Status
                </Text>
                <Badge color={getStatusColor(viewingInvoice.status)} size="sm">
                  {viewingInvoice.status}
                </Badge>
              </div>
              {viewingInvoice.description && (
                <div>
                  <Text size="sm" fw={500} className="text-gray-600">
                    Description
                  </Text>
                  <Text>{viewingInvoice.description}</Text>
                </div>
              )}
            </Stack>
          )}
        </Modal>
      </Container>
    </AdminLayout>
  )
}

export default PaymentsPage
