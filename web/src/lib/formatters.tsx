import React from 'react'

import dayjs from 'dayjs'
import humanize from 'humanize-string'

export const MAX_STRING_LENGTH = 70
export const LIST_PER_PAGE = 10

export const formatEnum = (values: string | string[] | null | undefined) => {
  let output = ''

  if (Array.isArray(values)) {
    const humanizedValues = values.map((value) => humanize(value))
    output = humanizedValues.join(', ')
  } else if (typeof values === 'string') {
    output = humanize(values)
  }

  return output
}

export const beforeQueryList = ({ page, search }) => {
  page = page ? parseInt(page, LIST_PER_PAGE) : 1
  return { variables: { page, search } }
}

export const jsonDisplay = (obj: unknown) => {
  return (
    <pre>
      <code>{JSON.stringify(obj, null, 2)}</code>
    </pre>
  )
}

export const truncate = (value: string | number, max?: number) => {
  let output = value?.toString() ?? ''
  const maxLength = max ? max : MAX_STRING_LENGTH
  if (output.length > maxLength) {
    output = output.substring(0, maxLength) + '...'
  }

  return output
}

export const jsonTruncate = (obj: unknown) => {
  return truncate(JSON.stringify(obj, null, 2))
}

export const timeTag = (dateTime?: string, format?: string) => {
  let output: string | JSX.Element = ''

  if (dateTime) {
    output = (
      <time dateTime={dateTime} title={dateTime}>
        {dayjs(dateTime).format(format ? format : 'DD-MM-YYYY HH:mm:ss A')}
      </time>
    )
  }

  return output
}

export const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

export function formatFSize(bytes) {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / Math.pow(1024, i)
  return `${size.toFixed(2)} ${units[i]}`
}

export const checkboxInputTag = (checked: boolean) => {
  return <input type="checkbox" checked={checked} disabled />
}

export function slugify(str: string) {
  str = str.replace(/^\s+|\s+$/g, '') // trim leading/trailing white space
  str = str.toLowerCase() // convert string to lowercase
  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // remove consecutive hyphens
  return str
}

export const mapGender = (g: number) => {
  return g == 1 ? 'Putra' : g == 2 ? 'Putri' : '--'
}

export const mapStatus = (s: number) => {
  return s == 1 ? 'Active' : 'Inactive'
}

export const mapStatusMessage = (s: number) => {
  const status = {
    1: 'Active',
    2: 'Inactive',
    3: 'Archived',
  }
  return status[s]
}

export const mapSystem = (t: number) => {
  return t == 1 ? 'System' : 'No'
}

// export const mapMessageType = (t: number) => {
//   return t == 1 ? 'System' : 'No'
// }
