import { useState, useEffect } from 'react'
import { SCHOOL_ACCOUNT } from '../config'
import { formatAccountNumber } from '../utils/accountParser'

const STORAGE_KEY = 'slunovrat-config'
const CURRENT_VERSION = 1

const DEFAULT_CONFIG = {
  version: CURRENT_VERSION,
  children: [],
  accountNumber: formatAccountNumber(SCHOOL_ACCOUNT)
}

function migrateConfig(storedData) {
  if (!storedData) {
    return DEFAULT_CONFIG
  }

  if (storedData.version === undefined) {
    return {
      version: CURRENT_VERSION,
      children: Array.isArray(storedData) ? storedData : [],
      accountNumber: formatAccountNumber(SCHOOL_ACCOUNT)
    }
  }

  return storedData
}

export function useAppConfig() {
  const [config, setConfig] = useState(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY)
      const parsed = item ? JSON.parse(item) : null
      return migrateConfig(parsed)
    } catch {
      return DEFAULT_CONFIG
    }
  })

  useEffect(() => {
    try {
      const oldChildrenData = window.localStorage.getItem('slunovrat-children')
      if (oldChildrenData && !window.localStorage.getItem(STORAGE_KEY)) {
        const children = JSON.parse(oldChildrenData)
        const migratedConfig = migrateConfig(children)
        setConfig(migratedConfig)
        window.localStorage.removeItem('slunovrat-children')
      }
    } catch {
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    } catch {
      console.error('Failed to save config to localStorage')
    }
  }, [config])

  const setChildren = (children) => {
    setConfig((prev) => ({ ...prev, children }))
  }

  const setAccountNumber = (accountNumber) => {
    setConfig((prev) => ({ ...prev, accountNumber }))
  }

  return {
    children: config.children,
    accountNumber: config.accountNumber,
    setChildren,
    setAccountNumber
  }
}
