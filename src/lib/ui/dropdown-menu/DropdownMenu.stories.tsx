import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'
import { Ellipsis, User, Settings, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '.'
import Button from '@/lib/ui/button'

const meta: Meta<typeof DropdownMenu> = {
  component: DropdownMenu,
  title: 'ui/DropdownMenu',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function DefaultStory() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <Ellipsis className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={fn()}>
            <User className="w-4 h-4 mr-2" />
            View profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={fn()}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={fn()}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}

export const WithLabel: Story = {
  render: function WithLabelStory() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="primary">Account Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={fn()}>
            <User className="w-4 h-4 mr-2" />
            View profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={fn()}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}

export const WithGroups: Story = {
  render: function WithGroupsStory() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={fn()}>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={fn()}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={fn()}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}

export const WithDangerVariant: Story = {
  render: function WithDangerVariantStory() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">Actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={fn()}>
            <User className="w-4 h-4 mr-2" />
            View profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={fn()}>
            <Settings className="w-4 h-4 mr-2" />
            Change role
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="danger" onClick={fn()}>
            <LogOut className="w-4 h-4 mr-2" />
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}

export const DisabledItems: Story = {
  render: function DisabledItemsStory() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">Limited Actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={fn()}>
            <User className="w-4 h-4 mr-2" />
            View profile
          </DropdownMenuItem>
          <DropdownMenuItem disabled onClick={fn()}>
            <Settings className="w-4 h-4 mr-2" />
            Change role (disabled)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="danger" disabled onClick={fn()}>
            <LogOut className="w-4 h-4 mr-2" />
            Remove (disabled)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}
