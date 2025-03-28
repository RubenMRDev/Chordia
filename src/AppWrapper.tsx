"use client"

import type React from "react"
import { useAuth } from "./context/AuthContext"
import App from "./App"

const AppWrapper: React.FC = () => {
  // Remove unused auth variable or use it with a void expression
  useAuth(); // Keep the hook call without storing the result

  return <App />
}

export default AppWrapper

