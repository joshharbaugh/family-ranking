import { Select as UiSelect } from 'radix-ui'
import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons'

interface SelectProps {
  label: string
  name: string
  value: string
  items: {
    label: string
    value: string
  }[]
  onValueChange: (value: string) => void
  disabled?: boolean
  className?: string
}

function Select({
  label,
  name,
  onValueChange,
  value,
  items,
  disabled,
  className,
}: SelectProps) {
  return (
    <UiSelect.Root
      name={name}
      onValueChange={onValueChange}
      value={value}
      disabled={disabled}
    >
      <UiSelect.Trigger
        className={`disabled:opacity-50 flex justify-between items-center min-w-[150px] px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0 focus:ring-2 focus:ring-indigo-500 ${className}`}
        aria-label={label}
      >
        <UiSelect.Value placeholder="Select a value…" />
        <UiSelect.Icon className="text-gray-500 dark:text-gray-400">
          <ChevronDownIcon />
        </UiSelect.Icon>
      </UiSelect.Trigger>
      <UiSelect.Portal>
        <UiSelect.Content className="overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 z-100">
          <UiSelect.Viewport className="p-[5px]">
            {items &&
              items.map((item, idx) => (
                <UiSelect.Item
                  key={idx}
                  value={item.value}
                  className="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-sm font-medium leading-none outline-none hover:bg-gray-300 dark:hover:bg-gray-800"
                >
                  <UiSelect.ItemText>{item.label}</UiSelect.ItemText>
                  <UiSelect.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
                    <CheckIcon />
                  </UiSelect.ItemIndicator>
                </UiSelect.Item>
              ))}
          </UiSelect.Viewport>
        </UiSelect.Content>
      </UiSelect.Portal>
    </UiSelect.Root>
  )
}

export default Select
