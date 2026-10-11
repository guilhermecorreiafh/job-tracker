import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createApplication } from './api'
import { STAGES, type Stage } from './types'

type Props = {
  onCreated: () => void
}

function today() {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

export function ApplicationForm({ onCreated }: Props) {
  const [open, setOpen] = useState(false)
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [url, setUrl] = useState('')
  const [stage, setStage] = useState<Stage>('Applied')
  const [appliedAt, setAppliedAt] = useState(today())
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function reset() {
    setCompany('')
    setRole('')
    setUrl('')
    setStage('Applied')
    setAppliedAt(today())
    setNotes('')
    setError(null)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)

    try {
      await createApplication({
        company,
        role,
        url: url || null,
        stage,
        appliedAt: appliedAt || null,
        notes: notes || null,
      })
      reset()
      setOpen(false)
      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Nova candidatura</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova candidatura</DialogTitle>
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
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}