import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import Button from '.'

const meta: Meta<typeof Button> = {
  component: Button,
  args: { onClick: fn() },
  title: 'ui/Button',
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: 'Primary',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
}

export const Danger: Story = {
  args: {
    children: 'Delete',
    variant: 'danger',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
}
