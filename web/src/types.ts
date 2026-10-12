export type Stage = 'Wishlist' | 'Applied' | 'Interview' | 'TechnicalTest' | 'Offer' | 'Closed'

export type JobApplication = {
    id: number
    company: string
    role: string
    url: string | null
    stage: Stage
    appliedAt: string | null
    notes: string | null
    createdAt: string
}

export const STAGES: { id: Stage; name: string }[] = [
    {id: 'Wishlist', name: 'Quero aplicar'},
    {id: 'Applied', name: 'Aplicado'},
    {id: 'Interview', name: 'Entrevista'},
    {id: 'TechnicalTest', name: 'Teste Técnico'},
    {id: 'Offer', name: 'Proposta'},
    {id: 'Closed', name: 'Encerrado'},
]

export type StageChange = {
    fromStage : Stage | null
    toStage: Stage
    changedAt: string
}

export type Stats = {
    total: number
    byStage: {stage: Stage; count: number}[]
    byWeek: {weekStart: string; count: number}[]
    averageResponseDays: number | null
}