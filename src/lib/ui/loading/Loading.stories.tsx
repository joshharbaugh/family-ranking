import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Loading from '.'

const meta: Meta<typeof Loading> = {
  component: Loading,
  title: 'ui/Loading',
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Loading>

export const Default: Story = {}
