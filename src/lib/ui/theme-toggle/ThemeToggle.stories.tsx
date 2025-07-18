import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { ThemeToggle } from '.'

const meta: Meta<typeof ThemeToggle> = {
  component: ThemeToggle,
  args: {
    onClick: fn(),
    toggleTheme: fn(),
    updateFirebaseTheme: fn(),
    theme: 'light',
  },
  title: 'ui/ThemeToggle',
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ThemeToggle>

export const Default: Story = {}
