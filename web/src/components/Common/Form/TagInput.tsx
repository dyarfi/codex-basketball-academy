import { useState } from 'react'

import { TagsInput } from '@mantine/core'

export function TagInput({ items, onChange, defaultValue = [], disabled }) {
  const [searchValue, setSearchValue] = useState('')
  const [finalValue, setFinalValue] = useState([])

  const onChangeAction = (e: React.SetStateAction<string[]>) => {
    setFinalValue(e)
    return onChange(
      items
        .filter((ix) => finalValue.some((tag) => tag === ix.label))
        .map(({ value }) => ({
          tagId: value,
        }))
    )
  }
  // console.log({ items })
  // console.log({ defaultValue })

  return (
    <TagsInput
      disabled={disabled}
      data={items}
      maxTags={5}
      description="Max 5 tags"
      placeholder="Enter tag"
      searchValue={searchValue}
      onSearchChange={(e) => setSearchValue(e)}
      onChange={onChangeAction}
      defaultValue={defaultValue.map((tag) => tag.label)}
      // value={finalValue}
      // hiddenInputProps={{ name: 'tags' }}
      // hiddenInputValuesDivider=","
    />
  )
}
