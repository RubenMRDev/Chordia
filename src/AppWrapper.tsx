"use client"

import type React from "react"
import { useAuth } from "./context/AuthContext"
import App from "./App"

const AppWrapper: React.FC = () => {
  const auth = useAuth()

  return <App />
}

export default AppWrapper

