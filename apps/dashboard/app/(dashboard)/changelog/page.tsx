'use client'

import { Heading, Subheading } from '@repo/ui/heading'
import { Badge } from '@repo/ui/badge'
import { Divider } from '@repo/ui/divider'

const changelogEntries = [
  {
    version: '1.2.0',
    date: '2024-01-15',
    type: 'feature',
    changes: [
      'Added Monitoring page with Jobs Management and Logs Viewer',
      'Added Configuration page with Secrets and Environment Variables management',
      'Made Quick Stats dynamic in sidebar',
      'Added Support and Changelog pages',
    ],
  },
  {
    version: '1.1.0',
    date: '2024-01-10',
    type: 'feature',
    changes: [
      'Implemented AI Providers management page',
      'Added provider health monitoring',
      'Added provider statistics and cost tracking',
    ],
  },
  {
    version: '1.0.0',
    date: '2024-01-01',
    type: 'release',
    changes: [
      'Initial release of Blog Writer Dashboard',
      'Dashboard overview with provider performance metrics',
      'Real-time monitoring and statistics',
      'Turborepo monorepo structure',
    ],
  },
]

function getVersionBadge(type: string) {
  switch (type) {
    case 'feature':
      return <Badge color="blue">Feature</Badge>
    case 'bugfix':
      return <Badge color="lime">Bug Fix</Badge>
    case 'release':
      return <Badge color="emerald">Release</Badge>
    default:
      return <Badge color="zinc">{type}</Badge>
  }
}

export default function ChangelogPage() {
  return (
    <>
      <Heading>Changelog</Heading>
      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
        All notable changes to the Blog Writer Dashboard will be documented here.
      </p>

      <div className="mt-8 space-y-8">
        {changelogEntries.map((entry, index) => (
          <div key={entry.version}>
            <div className="flex items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold">Version {entry.version}</h3>
                <p className="text-sm text-zinc-500">{new Date(entry.date).toLocaleDateString()}</p>
              </div>
              {getVersionBadge(entry.type)}
            </div>
            <ul className="mt-4 space-y-2">
              {entry.changes.map((change, changeIndex) => (
                <li key={changeIndex} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                  <span>{change}</span>
                </li>
              ))}
            </ul>
            {index < changelogEntries.length - 1 && <Divider className="mt-8" />}
          </div>
        ))}
      </div>
    </>
  )
}

