import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getStats } from './api'
import { STAGES, type Stage, type Stats } from './types'

function stageName(stage: Stage) {
  return STAGES.find(s => s.id === stage)?.name ?? stage
}

function formatWeek(value: string) {
  const [, month, day] = value.split('-')
  return `${day}/${month}`
}

const axisTick = { fontSize: 12, fill: 'var(--muted-foreground)' }

function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-4 text-sm font-medium">{title}</h2>
      <div className="h-64">{children}</div>
    </div>
  )
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setError(true))
  }, [])

  if (error) return <p className="text-sm text-destructive">Não foi possível carregar o dashboard.</p>
  if (!stats) return <p className="text-sm text-muted-foreground">Carregando...</p>

  const inProgress = stats.byStage
    .filter(s => s.stage !== 'Wishlist' && s.stage !== 'Closed')
    .reduce((sum, s) => sum + s.count, 0)

  const funnel = stats.byStage.map(s => ({ name: stageName(s.stage), count: s.count }))
  const weeks = stats.byWeek.map(w => ({ week: formatWeek(w.weekStart), count: w.count }))

  const average = stats.averageResponseDays
  const tooltipProps = {
    cursor: { fill: 'var(--muted)' },
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Total" value={String(stats.total)} />
        <StatTile label="Em andamento" value={String(inProgress)} hint="Entre aplicado e proposta" />
        <StatTile
          label="Tempo médio de resposta"
          value={average === null ? '—' : `${average.toLocaleString('pt-BR')} dias`}
          hint={average === null ? 'Nenhuma resposta ainda' : 'De aplicado até a próxima etapa'}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Candidaturas por etapa">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnel} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid horizontal={false} stroke="var(--border)" />
              <XAxis type="number" allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={100} tick={axisTick} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipProps} />
              <Bar dataKey="count" name="Candidaturas" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Candidaturas por semana">
          {weeks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma candidatura com data ainda.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeks} margin={{ right: 16 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="week" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} width={32} />
                <Tooltip {...tooltipProps} labelFormatter={label => `Semana de ${label}`} />
                <Bar dataKey="count" name="Candidaturas" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  )
}