/* eslint-disable import/order */
import React from 'react'
import {
  Table,
  Group,
  ActionIcon,
  Tooltip,
  Loader,
  Text,
  TableProps,
  Box,
  MantineColor,
  ActionIconProps,
} from '@mantine/core'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useAppTheme } from 'src/providers/ThemeProvider'
import clsx from 'clsx'

interface Column<T> {
  key: keyof T
  header: React.ReactNode
  render?: (value: T[keyof T], item: T) => React.ReactNode
  tdClassName?: string
  thClassName?: string
}

interface CrudTableProps<T extends { id: string }>
  extends Omit<TableProps, 'data'> {
  data: T[]
  columns: Column<T>[]

  isLoading?: boolean

  onEdit?: (item: T) => void
  onDelete?: (item: T) => void

  showActions?: boolean
  actionsHeader?: React.ReactNode

  emptyText?: React.ReactNode
  loadingText?: React.ReactNode

  containerClassName?: string
  rowClassName?: string

  editButtonProps?: ActionIconProps
  deleteButtonProps?: ActionIconProps

  renderActions?: (item: T) => React.ReactNode

  getRowProps?: (item: T) => React.HTMLAttributes<HTMLTableRowElement>
}

export function CrudTable<T extends { id: string }>({
  data,
  columns,

  isLoading = false,

  onEdit,
  onDelete,

  showActions = true,
  actionsHeader = 'Actions',

  emptyText = 'No records found',
  loadingText = 'Loading...',

  containerClassName,
  rowClassName,

  editButtonProps,
  deleteButtonProps,

  renderActions,
  getRowProps,

  ...tableProps
}: CrudTableProps<T>) {
  const { isDark } = useAppTheme()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12">
        <Loader size="lg" />
        <Text size="sm">{loadingText}</Text>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div
        className={clsx(
          'flex flex-col items-center justify-center rounded-lg border border-dashed py-12',
          isDark ? 'border-gray-600 bg-slate-800' : 'border-gray-300 bg-gray-50'
        )}
      >
        <Text
          size="lg"
          fw={500}
          className={isDark ? 'text-gray-400' : 'text-gray-500'}
        >
          {emptyText}
        </Text>
      </div>
    )
  }

  return (
    <Box
      className={clsx(
        'overflow-hidden rounded-lg border shadow-sm',
        isDark ? 'border-gray-500 bg-slate-800' : 'border-gray-200 bg-white',
        containerClassName
      )}
    >
      <Table.ScrollContainer minWidth={500}>
        <Table verticalSpacing="xs" sm={{ verticalSpacing: 'md' }} horizontalSpacing="xs" sm={{ horizontalSpacing: 'md' }} {...tableProps}>
          <Table.Thead className={isDark ? 'bg-slate-700' : 'bg-gray-50'}>
            <Table.Tr>
              {columns.map((col) => (
                <Table.Th
                  key={String(col.key)}
                  className={clsx(
                    'text-sm font-semibold',
                    isDark ? 'text-gray-400' : 'text-gray-900',
                    col.thClassName
                  )}
                >
                  {col.header}
                </Table.Th>
              ))}

              {showActions && (
                <Table.Th
                  className={clsx(
                    'text-sm font-semibold',
                    isDark ? 'text-gray-400' : 'text-gray-900'
                  )}
                >
                  {actionsHeader}
                </Table.Th>
              )}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {data.map((item) => (
              <Table.Tr
                key={item.id}
                className={clsx(
                  'transition-colors hover:bg-gray-50/50',
                  rowClassName
                )}
                {...getRowProps?.(item)}
              >
                {columns.map((col) => (
                  <Table.Td
                    key={String(col.key)}
                    className={clsx(
                      'text-sm',
                      isDark ? 'text-gray-400' : 'text-gray-700',
                      col.tdClassName
                    )}
                  >
                    {col.render
                      ? col.render(item[col.key], item)
                      : String(item[col.key] ?? '—')}
                  </Table.Td>
                ))}

                {showActions && (
                  <Table.Td>
                    {renderActions ? (
                      renderActions(item)
                    ) : (
                      <Group gap="xs">
                        {onEdit && (
                          <Tooltip label="Edit">
                            <ActionIcon
                              variant="light"
                              color="blue"
                              aria-label="Edit item"
                              onClick={() => onEdit(item)}
                              {...editButtonProps}
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                          </Tooltip>
                        )}

                        {onDelete && (
                          <Tooltip label="Delete">
                            <ActionIcon
                              variant="light"
                              color="red"
                              aria-label="Delete item"
                              onClick={() => onDelete(item)}
                              {...deleteButtonProps}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </Group>
                    )}
                  </Table.Td>
                )}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Box>
  )
}
