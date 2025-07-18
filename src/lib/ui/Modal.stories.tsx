import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import Modal from './Modal'
import Button from './Button'

const meta: Meta<typeof Modal> = {
  component: Modal,
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
