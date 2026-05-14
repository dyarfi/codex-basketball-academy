import { Group, Pagination, Text } from '@mantine/core'

import { navigate } from '@redwoodjs/router'

type RouteQuery = Record<string, boolean | number | string | null | undefined>
type RouteBuilder = (params?: RouteQuery) => string

interface AdminPaginationProps {
  label: string
  totalItems: number
  page: number
  pageSize?: number
  totalPages?: number
  route?: RouteBuilder
  query?: RouteQuery
  onPageChange?: (page: number) => void
}

const AdminPagination = ({
  label,
  totalItems,
  page,
  pageSize = 10,
  totalPages,
  route,
  query,
  onPageChange,
}: AdminPaginationProps) => {
  const resolvedTotalPages =
    totalPages ?? Math.max(1, Math.ceil(totalItems / pageSize))

  const currentPage = Math.min(page, resolvedTotalPages)
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalItems)

  const handlePageChange = (nextPage: number) => {
    onPageChange?.(nextPage)

    if (!route) {
      return
    }

    const params: RouteQuery = { ...query }

    if (nextPage > 1) {
      params.page = nextPage
    } else {
      delete params.page
    }

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') {
        delete params[key]
      }
    }

    navigate(route(Object.keys(params).length > 0 ? params : undefined))
  }

  return (
    <Group justify="flex-end" align="center" mt="sm" mb="md">
      <Text size="sm" c="dimmed">
        Showing {start}-{end} of {totalItems} {label}
      </Text>
      {resolvedTotalPages > 1 && (
        <Pagination
          boundaries={2}
          total={resolvedTotalPages}
          value={currentPage || 1}
          size="sm"
          onChange={handlePageChange}
        />
      )}
    </Group>
  )
}

export default AdminPagination
