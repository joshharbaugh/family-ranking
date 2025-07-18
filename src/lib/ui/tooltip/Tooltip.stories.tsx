import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Tooltip from '.'
import Button from '@/lib/ui/button'

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  title: 'ui/Tooltip',
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <Tooltip content="Tooltip text">
      <Button>Hover me</Button>
    </Tooltip>
  ),
}
