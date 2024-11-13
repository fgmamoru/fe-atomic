'use client'
import dynamic from 'next/dynamic'
import React from 'react'
import useLocalStorageState from 'use-local-storage-state'

export const useDebugMode = () => {
  const [debugMode, setDebugMode] = useLocalStorageState('debugMode', {
    defaultValue: "false",
  })

  const toggleDebugMode = () => {
    setDebugMode((prev) => (prev === "true" ? "false" : "true"))
  }

  const host = getHostNextCompatible()

  const hostIncludesTestnet = host.includes("testnet") || host.includes("localhost")

  return { debugMode: debugMode === "true" || hostIncludesTestnet, toggleDebugMode }
}

const getHostNextCompatible = () => {
  let host: string;

  if (typeof window === "undefined") {
    host = process?.env?.HOST || ""
  } else {
    host = window.location.host
  }

  return host;
}

export const DebugToggle = () => {
  const { debugMode, toggleDebugMode } = useDebugMode()

  return (
    <div>
      <button onClick={toggleDebugMode}>Toggle debug mode</button>
      {debugMode && <div>Debug mode is enabled</div>}
    </div>
  )
}

export const ShowInDebug = ({ children }
  : { children: React.ReactNode }
) => {
  const { debugMode } = useDebugMode()
  const _children = React.Children.map(children, (child) =>
    React.cloneElement(child as React.ReactElement, {})
  )

  return debugMode ? _children : null
}
