/* eslint-disable import/order */
import React from 'react'
import {
  Table,
  Group,
  Button,
  ActionIcon,
  Tooltip,
  Loader,
  Text,
} from '@mantine/core'
import { IconEdit, IconTrash } from '@tabler/icons-react'

interface Column<T> {
  key: keyof T
  header: string
  render?: (value: any, item: T) => React.ReactNode
}

interface CrudTableProps<T extends { id: string }> {
  data: T[]
  columns: Column<T>[]
  isLoading?: boolean
  onEdit: (item: T) => void
  onDelete: (item: T) => void
}

export function CrudTable<T extends { id: string }>({
  data,
  columns,
  isLoading = false,
  onEdit,
  onDelete,
}: CrudTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-12">
        <Text size="lg" fw={500} className="text-gray-500">
          No records found
        </Text>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <Table
        striped
        highlightOnHover
        verticalSpacing="md"
        horizontalSpacing="lg"
      >
        <Table.Thead className="bg-gray-50">
          <Table.Tr>
            {columns.map((col) => (
              <Table.Th
                key={String(col.key)}
                className="text-sm font-semibold text-gray-900"
              >
                {col.header}
              </Table.Th>
            ))}
            <Table.Th className="text-sm font-semibold text-gray-900">
              Actions
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((item) => (
            <Table.Tr
              key={item.id}
              className="transition-colors hover:bg-gray-50/50"
            >
              {columns.map((col) => (
                <Table.Td
                  key={String(col.key)}
                  className="text-sm text-gray-700"
                >
                  {col.render
                    ? col.render(item[col.key], item)
                    : String(item[col.key] ?? '—')}
                </Table.Td>
              ))}
              <Table.Td>
                <Group gap="xs">
                  <Tooltip label="Edit">
                    <ActionIcon
                      variant="light"
                      color="blue"
                      onClick={() => onEdit(item)}
                      aria-label="Edit item"
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete">
                    <ActionIcon
                      variant="light"
                      color="red"
                      onClick={() => onDelete(item)}
                      aria-label="Delete item"
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  )
}
