import React from 'react'
import { Spinner } from 'react-bootstrap'
import './LoaderSpinner.css'

interface SpinnerProps {
  message?: string
}

const LoadingSpinner: React.FC<SpinnerProps> = ({ message }) => {
  return (
    <div className="spinner-overlay">
      <div className="spinner-square">
        <div className="square-1 square"></div>
        <div className="square-2 square"></div>
        <div className="square-3 square"></div>
</div>
    </div>
  )
}

export default LoadingSpinner
