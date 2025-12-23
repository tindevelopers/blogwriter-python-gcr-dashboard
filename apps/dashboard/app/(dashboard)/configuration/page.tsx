'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@repo/ui/badge'
import { Button } from '@repo/ui/button'
import {
  Dialog,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogDescription,
} from '@repo/ui/dialog'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@repo/ui/description-list'
import { Divider } from '@repo/ui/divider'
import { Field, FieldLabel, Fieldset, Legend } from '@repo/ui/fieldset'
import { Heading, Subheading } from '@repo/ui/heading'
import { Input } from '@repo/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/table'
import { Textarea } from '@repo/ui/textarea'
import {
  useSecrets,
  useCreateSecret,
  useUpdateSecret,
  useDeleteSecret,
  useEnvVars,
  useUpdateEnvVars,
  useClearCache,
  useStatus,
} from '@/lib/api/hooks'
import { TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/20/solid'

// Mock data for demo mode
const mockSecrets = [
  {
    name: 'OPENAI_API_KEY',
    type: 'api_key',
    last_updated: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    name: 'ANTHROPIC_API_KEY',
    type: 'api_key',
    last_updated: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    name: 'DATABASE_URL',
    type: 'connection_string',
    last_updated: new Date(Date.now() - 3600000).toISOString(),
  },
]

const mockEnvVars = {
  NODE_ENV: 'production',
  API_URL: 'https://api.example.com',
  LOG_LEVEL: 'info',
  MAX_RETRIES: '3',
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export default function ConfigurationPage() {
  const { data: secretsData, error: secretsError, isLoading: isLoadingSecrets } = useSecrets()
  const { data: envVarsData, error: envVarsError, isLoading: isLoadingEnvVars } = useEnvVars()
  const { data: statusData } = useStatus()
  const createSecretMutation = useCreateSecret()
  const updateSecretMutation = useUpdateSecret()
  const deleteSecretMutation = useDeleteSecret()
  const updateEnvVarsMutation = useUpdateEnvVars()
  const clearCacheMutation = useClearCache()

  const [isCreateSecretOpen, setIsCreateSecretOpen] = useState(false)
  const [isEditSecretOpen, setIsEditSecretOpen] = useState(false)
  const [isDeleteSecretOpen, setIsDeleteSecretOpen] = useState(false)
  const [selectedSecret, setSelectedSecret] = useState<any>(null)
  const [secretForm, setSecretForm] = useState({ name: '', value: '', type: 'api_key' })

  const [envVars, setEnvVars] = useState<Record<string, string>>({})
  const [newEnvVarKey, setNewEnvVarKey] = useState('')
  const [newEnvVarValue, setNewEnvVarValue] = useState('')

  const isDemo = !!secretsError || !!envVarsError

  const displaySecrets = Array.isArray(secretsData?.secrets)
    ? secretsData.secrets
    : Array.isArray(secretsData)
      ? secretsData
      : mockSecrets

  const displayEnvVars = envVarsData || mockEnvVars

  // Initialize env vars state when data loads
  useEffect(() => {
    if (displayEnvVars && Object.keys(envVars).length === 0 && Object.keys(displayEnvVars).length > 0) {
      setEnvVars(displayEnvVars)
    }
  }, [displayEnvVars])

  const handleCreateSecret = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isDemo) {
      alert('Secret creation simulated in demo mode')
      setIsCreateSecretOpen(false)
      setSecretForm({ name: '', value: '', type: 'api_key' })
      return
    }
    try {
      await createSecretMutation.mutateAsync({
        name: secretForm.name,
        value: secretForm.value,
        type: secretForm.type,
      })
      setIsCreateSecretOpen(false)
      setSecretForm({ name: '', value: '', type: 'api_key' })
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleUpdateSecret = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isDemo) {
      alert('Secret update simulated in demo mode')
      setIsEditSecretOpen(false)
      setSelectedSecret(null)
      setSecretForm({ name: '', value: '', type: 'api_key' })
      return
    }
    try {
      await updateSecretMutation.mutateAsync({
        name: selectedSecret.name,
        data: {
          value: secretForm.value,
          type: secretForm.type,
        },
      })
      setIsEditSecretOpen(false)
      setSelectedSecret(null)
      setSecretForm({ name: '', value: '', type: 'api_key' })
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleDeleteSecret = async () => {
    if (isDemo) {
      alert('Secret deletion simulated in demo mode')
      setIsDeleteSecretOpen(false)
      setSelectedSecret(null)
      return
    }
    try {
      await deleteSecretMutation.mutateAsync(selectedSecret.name)
      setIsDeleteSecretOpen(false)
      setSelectedSecret(null)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleAddEnvVar = () => {
    if (newEnvVarKey && newEnvVarValue) {
      setEnvVars({ ...envVars, [newEnvVarKey]: newEnvVarValue })
      setNewEnvVarKey('')
      setNewEnvVarValue('')
    }
  }

  const handleRemoveEnvVar = (key: string) => {
    const newEnvVars = { ...envVars }
    delete newEnvVars[key]
    setEnvVars(newEnvVars)
  }

  const handleSaveEnvVars = async () => {
    if (isDemo) {
      alert('Environment variables update simulated in demo mode')
      return
    }
    try {
      await updateEnvVarsMutation.mutateAsync(envVars)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleClearCache = async () => {
    if (isDemo) {
      alert('Cache clear simulated in demo mode')
      return
    }
    if (confirm('Are you sure you want to clear the cache? This action cannot be undone.')) {
      await clearCacheMutation.mutateAsync()
    }
  }

  const openEditSecret = (secret: any) => {
    setSelectedSecret(secret)
    setSecretForm({ name: secret.name, value: '', type: secret.type || 'api_key' })
    setIsEditSecretOpen(true)
  }

  const openDeleteSecret = (secret: any) => {
    setSelectedSecret(secret)
    setIsDeleteSecretOpen(true)
  }

  return (
    <>
      <Heading>Configuration</Heading>

      {isDemo && (
        <div className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          <strong>Demo Mode</strong> — Showing sample data. Connect your backend API for live configuration
          management.
        </div>
      )}

      {/* Secrets Management Section */}
      <div className="mt-8 flex items-end justify-between gap-4">
        <Subheading>Secrets Management</Subheading>
        <Button onClick={() => setIsCreateSecretOpen(true)}>
          <PlusIcon className="h-4 w-4" />
          Create Secret
        </Button>
      </div>

      <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Last Updated</TableHeader>
            <TableHeader className="text-right">Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoadingSecrets ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-zinc-500">
                Loading secrets...
              </TableCell>
            </TableRow>
          ) : displaySecrets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-zinc-500">
                No secrets found
              </TableCell>
            </TableRow>
          ) : (
            displaySecrets.map((secret: any) => (
              <TableRow key={secret.name}>
                <TableCell className="font-medium font-mono">{secret.name}</TableCell>
                <TableCell>
                  <Badge color="zinc">{secret.type || 'unknown'}</Badge>
                </TableCell>
                <TableCell className="text-zinc-500">
                  {formatRelativeTime(secret.last_updated)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button plain onClick={() => openEditSecret(secret)}>
                      <PencilIcon className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button plain onClick={() => openDeleteSecret(secret)}>
                      <TrashIcon className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Environment Variables Section */}
      <Subheading className="mt-14">Environment Variables</Subheading>
      <div className="mt-4">
        <Fieldset>
          <Legend>Environment Variables</Legend>
          <div className="mt-4 space-y-4">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <Input
                  name={`env-${key}`}
                  value={key}
                  readOnly
                  className="font-mono"
                  style={{ flex: '0 0 200px' }}
                />
                <Input name={`env-value-${key}`} value={value} readOnly className="flex-1" />
                <Button plain onClick={() => handleRemoveEnvVar(key)}>
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Divider />
            <div className="flex gap-2">
              <Input
                name="new-env-key"
                placeholder="Variable name"
                value={newEnvVarKey}
                onChange={(e) => setNewEnvVarKey(e.target.value)}
                className="flex-1"
              />
              <Input
                name="new-env-value"
                placeholder="Variable value"
                value={newEnvVarValue}
                onChange={(e) => setNewEnvVarValue(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddEnvVar}>
                <PlusIcon className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
          <div className="mt-6">
            <Button onClick={handleSaveEnvVars} disabled={updateEnvVarsMutation.isPending}>
              {updateEnvVarsMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Fieldset>
      </div>

      {/* System Settings Section */}
      <Subheading className="mt-14">System Settings</Subheading>
      <div className="mt-4">
        <DescriptionList>
          <DescriptionTerm>API Endpoint</DescriptionTerm>
          <DescriptionDetails>
            {process.env.NEXT_PUBLIC_API_URL || 'https://blog-writer-api-dev-613248238610.europe-west9.run.app'}
          </DescriptionDetails>
          <DescriptionTerm>Environment</DescriptionTerm>
          <DescriptionDetails>{statusData?.environment || 'production'}</DescriptionDetails>
        </DescriptionList>
        <div className="mt-6">
          <Button onClick={handleClearCache} disabled={clearCacheMutation.isPending}>
            {clearCacheMutation.isPending ? 'Clearing...' : 'Clear Cache'}
          </Button>
        </div>
      </div>

      {/* Create Secret Dialog */}
      <Dialog open={isCreateSecretOpen} onClose={() => setIsCreateSecretOpen(false)}>
        <DialogTitle>Create Secret</DialogTitle>
        <DialogDescription>Add a new secret to the system</DialogDescription>
        <form onSubmit={handleCreateSecret}>
          <DialogBody>
            <Fieldset>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input
                  name="secret-name"
                  value={secretForm.name}
                  onChange={(e) => setSecretForm({ ...secretForm, name: e.target.value })}
                  placeholder="SECRET_NAME"
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Value</FieldLabel>
                <Textarea
                  name="secret-value"
                  value={secretForm.value}
                  onChange={(e) => setSecretForm({ ...secretForm, value: e.target.value })}
                  placeholder="Enter secret value"
                  rows={4}
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Type</FieldLabel>
                <select
                  name="secret-type"
                  value={secretForm.type}
                  onChange={(e) => setSecretForm({ ...secretForm, type: e.target.value })}
                  className="block w-full rounded-lg border border-zinc-950/10 bg-white px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-400"
                >
                  <option value="api_key">API Key</option>
                  <option value="connection_string">Connection String</option>
                  <option value="password">Password</option>
                  <option value="token">Token</option>
                  <option value="other">Other</option>
                </select>
              </Field>
            </Fieldset>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setIsCreateSecretOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createSecretMutation.isPending}>
              {createSecretMutation.isPending ? 'Creating...' : 'Create Secret'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Secret Dialog */}
      <Dialog open={isEditSecretOpen} onClose={() => setIsEditSecretOpen(false)}>
        <DialogTitle>Edit Secret</DialogTitle>
        <DialogDescription>Update secret: {selectedSecret?.name}</DialogDescription>
        <form onSubmit={handleUpdateSecret}>
          <DialogBody>
            <Fieldset>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input name="secret-name" value={selectedSecret?.name || ''} readOnly />
              </Field>
              <Field>
                <FieldLabel>Value</FieldLabel>
                <Textarea
                  name="secret-value"
                  value={secretForm.value}
                  onChange={(e) => setSecretForm({ ...secretForm, value: e.target.value })}
                  placeholder="Enter new secret value (leave empty to keep current)"
                  rows={4}
                />
              </Field>
              <Field>
                <FieldLabel>Type</FieldLabel>
                <select
                  name="secret-type"
                  value={secretForm.type}
                  onChange={(e) => setSecretForm({ ...secretForm, type: e.target.value })}
                  className="block w-full rounded-lg border border-zinc-950/10 bg-white px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-400"
                >
                  <option value="api_key">API Key</option>
                  <option value="connection_string">Connection String</option>
                  <option value="password">Password</option>
                  <option value="token">Token</option>
                  <option value="other">Other</option>
                </select>
              </Field>
            </Fieldset>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setIsEditSecretOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateSecretMutation.isPending}>
              {updateSecretMutation.isPending ? 'Updating...' : 'Update Secret'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Secret Dialog */}
      <Dialog open={isDeleteSecretOpen} onClose={() => setIsDeleteSecretOpen(false)}>
        <DialogTitle>Delete Secret</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete the secret &quot;{selectedSecret?.name}&quot;? This action cannot be
          undone.
        </DialogDescription>
        <DialogActions>
          <Button plain onClick={() => setIsDeleteSecretOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeleteSecret} disabled={deleteSecretMutation.isPending}>
            {deleteSecretMutation.isPending ? 'Deleting...' : 'Delete Secret'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

