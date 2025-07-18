import type { Meta, StoryObj } from '@storybook/react'
import TextInput from './TextInput'

const meta: Meta<typeof TextInput> = {
  component: TextInput,
  title: 'ui/TextInput',
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof TextInput>

export const Default: Story = {
  args: {
    placeholder: 'Enter text',
  },
}
