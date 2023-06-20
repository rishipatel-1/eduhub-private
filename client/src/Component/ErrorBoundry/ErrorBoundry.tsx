import React, { ReactNode, Component } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor (props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false
    }
  }

  componentDidCatch (error: Error, errorInfo: React.ErrorInfo): void {
    console.error(error)
    this.setState({ hasError: true })
  }

  render () {
    const { hasError } = this.state
    const { children } = this.props

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
}

export default ErrorBoundary
