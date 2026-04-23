import { Group, Pagination, Text } from '@mantine/core'

interface AdminPaginationProps {
  label: string
  totalItems: number
  page: number
  pageSize?: number
  onPageChange: (page: number) => void
}

const AdminPagination = ({
  label,
  totalItems,
  page,
  pageSize = 10,
  onPageChange,
}: AdminPaginationProps) => {
  if (totalItems <= pageSize) {
    return null
  }

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalItems)

  return (
    <Group justify="space-between" align="center" mt="md">
      <Text size="sm" c="dimmed">
        Showing {start}-{end} of {totalItems} {label}
      </Text>
      <Pagination total={totalPages} value={currentPage} onChange={onPageChange} />
    </Group>
  )
}

export default AdminPagination
