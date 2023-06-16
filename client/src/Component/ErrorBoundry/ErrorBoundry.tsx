import React, { ReactNode, useEffect } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = React.useState(false)

  useEffect(() => {
    const errorHandler = (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => {
      console.error(error)
      setHasError(true)
    }

    window.onerror = errorHandler

    return () => {
      window.onerror = null
    }
  }, [])

  if (hasError) {
    return (
      <div>
        <h2>Something went wrong.</h2>
        <p>Please try again later or contact support.</p>
      </div>
    ) // You can customize the error message here
  }

  return <>{children}</>
}

export default ErrorBoundary
