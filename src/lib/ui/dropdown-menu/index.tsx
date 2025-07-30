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
        className={`${styles.DropdownMenuContent} bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700`}
        sideOffset={0}
        {...props}
      >
        {children}
        <DropdownMenuPrimitive.Arrow
          height="8"
          width="12"
          className="fill-gray-200 dark:fill-gray-700"
        />
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
})

export const DropdownMenuLabel = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.Label
      ref={forwardedRef}
      className={`${styles.DropdownMenuLabel} text-xs text-gray-500 dark:text-gray-400 p-2 pb-0`}
      {...props}
    />
  )
})

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
      className={`${styles.DropdownMenuItem} ${variant === 'danger' ? 'text-red-600 dark:text-red-400 hover:bg-rose-100 dark:hover:bg-rose-700/40' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} data-disabled:opacity-30 outline-none select-none rounded-sm flex items-center p-2 relative`}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  )
})
export const DropdownMenuGroup = DropdownMenuPrimitive.Group
export const DropdownMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.Separator
      ref={forwardedRef}
      className={`${styles.DropdownMenuSeparator} my-[5px] mx-[-5px] h-px bg-gray-200 dark:bg-gray-700`}
      {...props}
    />
  )
})
