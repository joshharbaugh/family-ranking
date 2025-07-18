import { Tooltip as UiTooltip } from 'radix-ui'
import './tooltip.css'

interface TooltipProps {
  content: string
  children: React.ReactNode
}

function Tooltip({ content, children }: TooltipProps) {
  return (
    <UiTooltip.Provider>
      <UiTooltip.Root delayDuration={0}>
        <UiTooltip.Trigger asChild>{children}</UiTooltip.Trigger>
        <UiTooltip.Portal>
          <UiTooltip.Content
            side="bottom"
            className="TooltipContent border border-gray-200 dark:border-gray-700 bg-white text-gray-900 dark:bg-gray-800 dark:text-white rounded-md shadow-lg p-2 text-sm"
          >
            {content}
          </UiTooltip.Content>
        </UiTooltip.Portal>
      </UiTooltip.Root>
    </UiTooltip.Provider>
  )
}

export default Tooltip
