/* eslint-disable react/display-name */
import * as React from 'react'
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui'
import styles from './styles.module.css'

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

export const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ children, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={forwardedRef}
        className={`${styles.DropdownMenuContent}`}
        sideOffset={5}
        {...props}
      >
        {children}
        <DropdownMenuPrimitive.Arrow className="fill-white" />
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
})

export const DropdownMenuLabel = DropdownMenuPrimitive.Label

interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  variant?: 'danger'
}

/**
 * A dropdown menu item component that extends Radix UI's DropdownMenu.Item
 * with custom styling and variant support.
 * 
 * @param children - The content to display inside the menu item
 * @param variant - Visual variant of the menu item. 'danger' applies red styling for destructive actions
 * @param props - Additional props passed to the underlying Radix DropdownMenu.Item
 * @param forwardedRef - Forwarded ref to the underlying DOM element
 * 
 * @example
 * ```tsx
 * <DropdownMenuItem>View profile</DropdownMenuItem>
 * <DropdownMenuItem variant="danger">Remove</DropdownMenuItem>
 * ```
 */
export const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ children, variant, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.Item
      ref={forwardedRef}
      className={`${styles.DropdownMenuItem} ${variant === 'danger' ? styles.DropdownMenuItem__danger : ''}`}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  )
})
export const DropdownMenuGroup = DropdownMenuPrimitive.Group
export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator
