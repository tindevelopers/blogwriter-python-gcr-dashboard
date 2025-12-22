import { Badge } from '@repo/ui/badge'
import { Divider } from '@repo/ui/divider'

export function Stat({
  title,
  value,
  change,
  changeLabel = 'from last period',
}: {
  title: string
  value: string
  change?: string
  changeLabel?: string
}) {
  return (
    <div>
      <Divider />
      <div className="mt-6 text-lg/6 font-medium sm:text-sm/6">{title}</div>
      <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">{value}</div>
      {change && (
        <div className="mt-3 text-sm/6 sm:text-xs/6">
          <Badge color={change.startsWith('+') ? 'lime' : change.startsWith('-') ? 'pink' : 'zinc'}>
            {change}
          </Badge>{' '}
          <span className="text-zinc-500">{changeLabel}</span>
        </div>
      )}
    </div>
  )
}

