import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import ErrorBoundary from '.'
import { useState } from 'react'

const meta: Meta<typeof ErrorBoundary> = {
  title: 'UI/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof ErrorBoundary>

// Component that throws an error
function ErrorThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('This is a test error for ErrorBoundary')
  }
  return <div>This component is working fine!</div>
}

// Component to test the error boundary
function TestErrorBoundary() {
  const [shouldThrow, setShouldThrow] = useState(false)

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShouldThrow(!shouldThrow)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {shouldThrow ? 'Fix Component' : 'Break Component'}
      </button>
      <ErrorBoundary>
        <ErrorThrowingComponent shouldThrow={shouldThrow} />
      </ErrorBoundary>
    </div>
  )
}

export const Default: Story = {
  render: () => <TestErrorBoundary />,
}

export const WithCustomFallback: Story = {
  render: () => (
    <div className="space-y-4">
      <ErrorBoundary
        fallback={
          <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
            Custom error message: Something went wrong!
          </div>
        }
      >
        <ErrorThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    </div>
  ),
}

export const WorkingComponent: Story = {
  render: () => (
    <ErrorBoundary>
      <div className="p-4 bg-green-100 border border-green-300 rounded">
        This component is working perfectly!
      </div>
    </ErrorBoundary>
  ),
}
