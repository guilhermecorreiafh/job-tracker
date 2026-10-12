import type { JobApplication, StageChange } from './types'

export type ApplicationInput = Omit<JobApplication, 'id' | 'createdAt'>

function toBody(input: ApplicationInput) {
  return JSON.stringify({
    company: input.company,
    role: input.role,
    url: input.url,
    stage: input.stage,
    appliedAt: input.appliedAt,
    notes: input.notes,
  })
}

export async function getApplications(): Promise<JobApplication[]> {
  const response = await fetch('/api/job-applications')

  if (!response.ok) {
    throw new Error('Erro ao carregar candidaturas')
  }

  return response.json()
}

export async function createApplication(input: ApplicationInput): Promise<void> {
  const response = await fetch('/api/job-applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: toBody(input),
  })

  if (!response.ok) {
    throw new Error('Confira os campos: empresa e cargo são obrigatórios, e o link precisa começar com https://')
  }
}

export async function updateApplication(application: JobApplication): Promise<void> {
  const response = await fetch(`/api/job-applications/${application.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: toBody(application),
  })

  if (!response.ok) {
    throw new Error('Erro ao salvar candidatura')
  }
}

export async function deleteApplication(id: number): Promise<void> {
  const response = await fetch(`/api/job-applications/${id}`, { method: 'DELETE' })

  if (!response.ok) {
    throw new Error('Erro ao excluir candidatura')
  }
}

export async function getHistory(id: number): Promise<StageChange[]> {
  const res = await fetch(`/api/job-applications/${id}/history`)
  if (!res.ok) throw new Error('Erro ao carregar histórico')
  return res.json()
}