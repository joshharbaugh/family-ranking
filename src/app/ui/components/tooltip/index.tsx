import { Tooltip } from 'radix-ui'
import './tooltip.style.css'

interface UITooltipProps {
  content: string
  children: React.ReactNode
}

function UITooltip({ content, children }: UITooltipProps) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="bottom"
            className="TooltipContent border border-gray-200 dark:border-gray-700 bg-white text-gray-900 dark:bg-gray-800 dark:text-white rounded-md shadow-lg p-2 text-sm"
          >
            {content}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

export default UITooltip
