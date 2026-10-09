export type Stage = 'Wishlist' | 'Applied' | 'Interview' | 'TechnicalTest' | 'Offer' | 'Closed'

export type JobApplication = {
    id: number
    company: string
    role: string
    url: string | null
    stage: Stage
    applieadAt: string | null
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