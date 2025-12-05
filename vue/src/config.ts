/**
 * Application configuration
 * Uses environment variables for deployment flexibility
 */

export const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:4001/graphql'

export const WS_URL =
  import.meta.env.VITE_WS_URL || 'ws://localhost:4001/graphql'

