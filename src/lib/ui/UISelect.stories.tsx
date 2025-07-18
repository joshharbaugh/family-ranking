import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import UISelect from './UISelect'

const meta: Meta<typeof UISelect> = {
  component: UISelect,
  title: 'ui/UISelect',
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof UISelect>

export const Default: Story = {
  render: function DefaultStory() {
    const [value, setValue] = useState('one')
    return (
      <UISelect
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
