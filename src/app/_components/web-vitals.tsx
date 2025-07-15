'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    switch (metric.name) {
      case 'CLS': {
        console.log('CLS', metric.value.toFixed(2))
      }
      case 'INP': {
        console.log('INP', metric.value.toFixed(2))
      }
      case 'FCP': {
        console.log('FCP', metric.value.toFixed(2))
      }
      case 'LCP': {
        console.log('LCP', metric.value.toFixed(2))
      }
      case 'TTFB': {
        console.log('TTFB', metric.value.toFixed(2))
      }
    }
  })
}
