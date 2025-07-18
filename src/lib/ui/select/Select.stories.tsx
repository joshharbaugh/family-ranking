import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'
import { useState } from 'react'
import Select from '.'

const meta: Meta<typeof Select> = {
  component: Select,
  args: { onValueChange: fn() },
  title: 'ui/Select',
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Select>

export const Default: Story = {
  render: function DefaultStory() {
    const [value, setValue] = useState('one')
    return (
      <Select
        label="Select"
        name="select"
        value={value}
        onValueChange={setValue}
        items={[
          { label: 'One', value: 'one' },
          { label: 'Two', value: 'two' },
        ]}
      />
    )
  },
}
