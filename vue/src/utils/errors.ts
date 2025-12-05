/**
 * Utility functions for error handling
 */

/**
 * Clean GraphQL error messages by removing the "[GraphQL]" prefix
 * @param message - The error message to clean
 * @returns Cleaned error message
 */
export function cleanGraphQLError(message: string): string {
  if (!message) return 'An unexpected error occurred'

  // Remove [GraphQL] prefix if present
  return message.replace(/^\[GraphQL\]\s*/i, '').trim()
}

/**
 * Extract error message from various error types
 * @param error - The error object
 * @returns Cleaned error message string
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected error occurred'

  if (typeof error === 'string') {
    return cleanGraphQLError(error)
  }

  if (error instanceof Error) {
    return cleanGraphQLError(error.message)
  }

  if (typeof error === 'object' && 'message' in error) {
    return cleanGraphQLError(String((error as { message: unknown }).message))
  }

  return 'An unexpected error occurred'
}
