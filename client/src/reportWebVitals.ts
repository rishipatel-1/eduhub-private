import { type ReportHandler } from 'web-vitals'

const reportWebVitals = async (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry != null && typeof onPerfEntry === 'function') {
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals')
    getCLS(onPerfEntry)
    getFID(onPerfEntry)
    getFCP(onPerfEntry)
    getLCP(onPerfEntry)
    getTTFB(onPerfEntry)
  }
}

export default reportWebVitals
