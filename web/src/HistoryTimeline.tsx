import { useEffect, useState } from 'react'
import { getHistory } from './api'
import { STAGES, type Stage, type StageChange } from './types'

const DAY_MS = 1000 * 60 * 60 * 24

function stageName(stage: Stage) {
  return STAGES.find(s => s.id === stage)?.name ?? stage
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR')
}

function daysLabel(from: string, to: string) {
  const days = Math.round((new Date(to).getTime() - new Date(from).getTime()) / DAY_MS)
  if (days === 0) return 'no mesmo dia'
  if (days === 1) return '1 dia depois'
  return `${days} dias depois`
}

export function HistoryTimeline({ applicationId }: { applicationId: number }) {
  const [history, setHistory] = useState<StageChange[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    getHistory(applicationId)
      .then(setHistory)
      .catch(() => setError(true))
  }, [applicationId])

  if (error) return <p className="text-sm text-destructive">Não foi possível carregar o histórico.</p>
  if (!history) return <p className="text-sm text-muted-foreground">Carregando histórico...</p>

  return (
    <div className="border-t pt-4">
      <h3 className="mb-3 text-sm font-medium">Histórico</h3>
      <ol className="relative ml-2 space-y-4 border-l">
        {history.map((change, i) => {
          const previous = history[i - 1]
          return (
            <li key={i} className="ml-4">
              <span className="absolute -left-1.5 mt-1.5 size-3 rounded-full bg-primary" />
              <p className="text-sm font-medium">{stageName(change.toStage)}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(change.changedAt)}
                {previous && ` · ${daysLabel(previous.changedAt, change.changedAt)}`}
              </p>
            </li>
          )
        })}
      </ol>
    </div>
  )
}