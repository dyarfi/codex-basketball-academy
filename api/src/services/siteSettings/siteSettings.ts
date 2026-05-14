import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const siteSettings: QueryResolvers['siteSettings'] = () => {
  return db.siteSetting.findMany({
    orderBy: [{ group: 'asc' }, { key: 'asc' }],
  })
}

export const siteSettingsByGroup: QueryResolvers['siteSettingsByGroup'] = ({
  group,
}) => {
  return db.siteSetting.findMany({
    where: { group },
    orderBy: { key: 'asc' },
  })
}

export const siteSetting: QueryResolvers['siteSetting'] = ({ id }) => {
  return db.siteSetting.findUnique({
    where: { id },
  })
}

export const siteSettingByKey: QueryResolvers['siteSettingByKey'] = ({
  key,
}) => {
  return db.siteSetting.findUnique({
    where: { key },
  })
}

export const createSiteSetting: MutationResolvers['createSiteSetting'] = ({
  key,
  label,
  group,
  value,
  valueType = 'text',
}) => {
  return db.siteSetting.create({
    data: {
      key,
      label,
      group,
      value,
      valueType,
    },
  })
}

export const updateSiteSetting: MutationResolvers['updateSiteSetting'] = ({
  id,
  label,
  value,
  valueType,
}) => {
  return db.siteSetting.update({
    where: { id },
    data: {
      ...(label && { label }),
      ...(value && { value }),
      ...(valueType && { valueType }),
    },
  })
}

export const deleteSiteSetting: MutationResolvers['deleteSiteSetting'] = ({
  id,
}) => {
  db.siteSetting.delete({
    where: { id },
  })
  return true
}
