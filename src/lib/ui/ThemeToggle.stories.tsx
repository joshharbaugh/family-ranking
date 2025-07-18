import type { Meta, StoryObj } from '@storybook/react'
import { ThemeToggle } from './ThemeToggle'

const meta: Meta<typeof ThemeToggle> = {
  component: ThemeToggle,
  title: 'ui/ThemeToggle',
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ThemeToggle>

export const Default: Story = {}
