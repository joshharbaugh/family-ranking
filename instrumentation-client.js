// Initialize analytics before the app starts
console.log('Analytics initialized')

// Set up global error tracking
window.addEventListener('error', (event) => {
  // Send to error tracking service
  reportError(event.error)
})
