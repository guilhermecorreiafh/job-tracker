import type { JobApplication } from "./types";

export async function getApplications() : Promise<JobApplication[]>{
    const response = await fetch('/api/job-applications')

    if (!response.ok){
        throw new Error('Erro ao carregar candidaturas')
    
    }

    return response.json()
}

export async function updateApplication(application : JobApplication) : Promise<void> {
    const response = await fetch(`/api/job-applications/${application.id}`{
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            company: application.company,
            role: application.role,
            url: application.url,
            stage: application.stage,
            appliedAt: application.applieadAt,
            notes: application.notes,
        }),
    })

    if(!response.ok){
        throw new Error('Erro ao salvar candidatura')
    }
}