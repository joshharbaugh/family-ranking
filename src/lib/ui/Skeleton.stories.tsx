import type { Meta, StoryObj } from '@storybook/react'
import { SkeletonBox, SkeletonText } from './Skeleton'

const meta: Meta = {
  title: 'ui/Skeleton',
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj

export const Box: Story = {
  render: () => <SkeletonBox className="w-32 h-8" />,
}

export const Text: Story = {
  render: () => <SkeletonText className="w-24 h-4" />,
}
