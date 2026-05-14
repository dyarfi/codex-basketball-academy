import React, { createContext, useContext, useEffect, useState } from 'react'

import { useQuery } from '@apollo/client'

import { SITE_SETTINGS_QUERY } from 'src/graphql/mutations'

export interface SiteSetting {
  id: number
  key: string
  label: string
  group: string
  value: string
  valueType: string
}

interface SettingsContextType {
  settings: Record<string, string>
  settingsList: SiteSetting[]
  loading: boolean
  error: Error | null
  getSetting: (key: string, defaultValue?: string) => string
  refetch: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settingsMap, setSettingsMap] = useState<Record<string, string>>({})
  const [settingsList, setSettingsList] = useState<SiteSetting[]>([])

  const { data, loading, error, refetch } = useQuery(SITE_SETTINGS_QUERY, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 30000, // Refetch every 30 seconds
  })

  useEffect(() => {
    if (data?.siteSettings) {
      setSettingsList(data.siteSettings)
      const map: Record<string, string> = {}
      data.siteSettings.forEach((setting: SiteSetting) => {
        map[setting.key] = setting.value
      })
      setSettingsMap(map)
    }
  }, [data])

  const getSetting = (key: string, defaultValue = ''): string => {
    return settingsMap[key] ?? defaultValue
  }

  const value: SettingsContextType = {
    settings: settingsMap,
    settingsList,
    loading,
    error: error as Error | null,
    getSetting,
    refetch,
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}
