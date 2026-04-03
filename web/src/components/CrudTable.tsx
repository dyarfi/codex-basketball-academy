interface Column<T> {
  key: keyof T
  header: string
  render?: (value: T[keyof T], item: T) => React.ReactNode
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
      <div className="flex justify-center py-8">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-gray-600">No records found</div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
              >
                {col.header}
              </th>
            ))}
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr
              key={item.id}
              className={`border-b border-gray-200 ${
                idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              } hover:bg-gray-100`}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="px-6 py-4 text-sm text-gray-700"
                >
                  {col.render
                    ? col.render(item[col.key], item)
                    : String(item[col.key])}
                </td>
              ))}
              <td className="px-6 py-4 text-sm flex space-x-2">
                <button
                  onClick={() => onEdit(item)}
                  aria-label="Edit item"
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item)}
                  aria-label="Delete item"
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
