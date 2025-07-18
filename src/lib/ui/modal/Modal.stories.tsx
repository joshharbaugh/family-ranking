import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'
import { useState } from 'react'
import Modal from '.'
import Button from '@/lib/ui/button'

const meta: Meta<typeof Modal> = {
  component: Modal,
  args: { onClose: fn() },
  title: 'ui/Modal',
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Modal>

export const Default: Story = {
  render: function DefaultStory() {
    const [open, setOpen] = useState(false)
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        {open && (
          <Modal onClose={() => setOpen(false)}>
            {() => (
              <div className="p-4">
                <p>Modal content</p>
                <Button onClick={() => setOpen(false)}>Close</Button>
              </div>
            )}
          </Modal>
        )}
      </div>
    )
  },
}
