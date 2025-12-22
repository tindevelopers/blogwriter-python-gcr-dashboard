# @repo/ui

Shared Catalyst UI components for the monorepo.

## Components

This package contains all the Catalyst UI components that can be used across applications in the monorepo.

## Usage

```tsx
import { Button } from '@repo/ui/button'
import { Table } from '@repo/ui/table'

export default function MyComponent() {
  return (
    <>
      <Button>Click me</Button>
      <Table />
    </>
  )
}
```

## Development

The components are exported as TypeScript files and will be transpiled by the consuming application.

