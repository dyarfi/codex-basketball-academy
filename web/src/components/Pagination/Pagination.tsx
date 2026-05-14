import { useParams } from '@redwoodjs/router'

import AdminPagination from 'src/components/AdminPagination/AdminPagination'

type RouteQuery = Record<string, boolean | number | string | null | undefined>
type RouteBuilder = (params?: RouteQuery) => string

interface PaginationProps {
  count: number
  route: RouteBuilder
  label?: string
  pageSize?: number
  query?: RouteQuery
}

const getPageFromParam = (value: unknown) => {
  const parsedPage = Number(value)

  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
}

const Pagination = ({
  count,
  route,
  label = 'items',
  pageSize = 10,
  query,
}: PaginationProps) => {
  const { page = 1, search } = useParams()

  return (
    <AdminPagination
      label={label}
      totalItems={count}
      page={getPageFromParam(page)}
      pageSize={pageSize}
      route={route}
      query={{
        search: typeof search === 'string' ? search : undefined,
        ...query,
      }}
    />
  )
}

export default Pagination
