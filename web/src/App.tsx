import { useEffect, useRef, useState } from 'react'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/components/kibo-ui/kanban'
import { getApplications, updateApplication } from './api'
import { ApplicationForm } from './ApplicationForm'
import { STAGES, type JobApplication, type Stage } from './types'

type BoardItem = {
  id: string
  name: string
  column: Stage
  application: JobApplication
}

function toItem(application: JobApplication): BoardItem {
  return {
    id: String(application.id),
    name: application.company,
    column: application.stage,
    application,
  }
}

function formatDate(date: string | null) {
  if (!date) return null
  return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR')
}

function App() {
  const [items, setItems] = useState<BoardItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const itemsRef = useRef<BoardItem[]>([])

  function updateItems(next: BoardItem[]) {
    itemsRef.current = next
    setItems(next)
  }

  function load() {
    getApplications()
      .then(applications => {
        updateItems(applications.map(toItem))
        setError(null)
      })
      .catch(() => setError('Não foi possível conectar à API'))
  }

  useEffect(load, [])

  async function handleDragEnd(event: DragEndEvent) {
    const item = itemsRef.current.find(i => i.id === event.active.id)

    if (!item || item.column === item.application.stage) return

    const updated = { ...item.application, stage: item.column }

    try {
      await updateApplication(updated)
      updateItems(itemsRef.current.map(i => (i.id === item.id ? { ...i, application: updated } : i)))
    } catch {
      setError('Não foi possível salvar a mudança de etapa')
      load()
    }
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-semibold">Job Tracker</h1>
          <p className="text-sm text-muted-foreground">{items.length} candidaturas</p>
        </div>
        <ApplicationForm onCreated={load} />
      </div>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      <div className="overflow-x-auto pb-4">
        <div className="min-w-[1200px]">
          <KanbanProvider
            columns={STAGES}
            data={items}
            onDataChange={updateItems}
            onDragEnd={handleDragEnd}
          >
            {column => (
              <KanbanBoard id={column.id} key={column.id}>
                <KanbanHeader className="flex items-center justify-between">
                  <span>{column.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {items.filter(i => i.column === column.id).length}
                  </span>
                </KanbanHeader>

                <KanbanCards id={column.id}>
                  {(item: BoardItem) => (
                    <KanbanCard key={item.id} id={item.id} name={item.name} column={item.column}>
                      <p className="text-sm font-medium">{item.application.company}</p>
                      <p className="text-xs text-muted-foreground">{item.application.role}</p>
                      {item.application.appliedAt && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Aplicado em {formatDate(item.application.appliedAt)}
                        </p>
                      )}
                    </KanbanCard>
                  )}
                </KanbanCards>
              </KanbanBoard>
            )}
          </KanbanProvider>
        </div>
      </div>
    </main>
  )
}

export default App