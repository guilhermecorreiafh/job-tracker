import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createApplication, deleteApplication, updateApplication } from './api'
import { STAGES, type JobApplication, type Stage } from './types'

type Props = {
  editing: JobApplication | null
  onClose: () => void
  onSaved: () => void
}

function today() {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

export function ApplicationForm({ editing, onClose, onSaved }: Props) {
  const [company, setCompany] = useState(editing?.company ?? '')
  const [role, setRole] = useState(editing?.role ?? '')
  const [url, setUrl] = useState(editing?.url ?? '')
  const [stage, setStage] = useState<Stage>(editing?.stage ?? 'Applied')
  const [appliedAt, setAppliedAt] = useState(editing ? (editing.appliedAt ?? '') : today())
  const [notes, setNotes] = useState(editing?.notes ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)

    const data = {
      company,
      role,
      url: url || null,
      stage,
      appliedAt: appliedAt || null,
      notes: notes || null,
    }

    try {
      if (editing) {
        await updateApplication({ ...editing, ...data })
      } else {
        await createApplication(data)
      }
      onClose()
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!editing || !window.confirm(`Excluir a candidatura da ${editing.company}?`)) return

    try {
      await deleteApplication(editing.id)
      onClose()
      onSaved()
    } catch {
      setError('Não foi possível excluir')
    }
  }

  return (
    <Dialog open onOpenChange={open => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar candidatura' : 'Nova candidatura'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="company">Empresa</Label>
            <Input id="company" value={company} onChange={e => setCompany(e.target.value)} required maxLength={100} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Cargo</Label>
            <Input id="role" value={role} onChange={e => setRole(e.target.value)} required maxLength={150} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="url">Link da vaga</Label>
            <Input id="url" type="url" placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="stage">Etapa</Label>
              <select
                id="stage"
                value={stage}
                onChange={e => setStage(e.target.value as Stage)}
                className="h-9 rounded-md border bg-transparent px-3 text-sm"
              >
                {STAGES.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="appliedAt">Data</Label>
              <Input id="appliedAt" type="date" value={appliedAt} onChange={e => setAppliedAt(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Anotações</Label>
            <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <DialogFooter>
            {editing && (
              <Button type="button" variant="destructive" className="mr-auto" onClick={handleDelete}>
                Excluir
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}