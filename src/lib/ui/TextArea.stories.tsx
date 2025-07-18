import type { Meta, StoryObj } from '@storybook/react'
import TextArea from './TextArea'

const meta: Meta<typeof TextArea> = {
  component: TextArea,
  title: 'ui/TextArea',
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof TextArea>

export const Default: Story = {
  args: {
    placeholder: 'Enter text',
  },
}
