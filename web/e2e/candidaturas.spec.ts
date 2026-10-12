import { expect, test } from '@playwright/test'

test('cria, mostra o histórico e exclui uma candidatura', async ({ page }) => {
  const company = `Empresa Teste ${Date.now()}`

  await page.goto('/')
  await page.getByRole('button', { name: 'Nova candidatura' }).click()

  const form = page.getByRole('dialog')
  await form.getByLabel('Empresa', { exact: true }).fill(company)
  await form.getByLabel('Cargo', { exact: true }).fill('Desenvolvedor Full Stack Júnior')
  await form.getByLabel('Etapa', { exact: true }).selectOption('Applied')
  await form.getByRole('button', { name: 'Salvar' }).click()

  await expect(page.getByText(company)).toBeVisible()

  await page.getByRole('button', { name: `Editar ${company}`, exact: true }).click()
  const dialog = page.getByRole('dialog')

  await expect(dialog.getByRole('heading', { name: 'Histórico' })).toBeVisible()
  await expect(dialog.getByRole('listitem').filter({ hasText: 'Aplicado' })).toBeVisible()

  page.once('dialog', confirm => confirm.accept())
  await dialog.getByRole('button', { name: 'Excluir' }).click()

  await expect(page.getByText(company)).not.toBeVisible()
})

test('busca filtra os cards por empresa', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Lumen Pay')).toBeVisible()

  await page.getByPlaceholder('Buscar por empresa ou cargo').fill('Nimbus')

  await expect(page.getByText('Nimbus Tech')).toBeVisible()
  await expect(page.getByText('Lumen Pay')).not.toBeVisible()
})

test('dashboard mostra os indicadores', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Dashboard' }).click()

  await expect(page.getByText('Tempo médio de resposta')).toBeVisible()
  await expect(page.getByText('Candidaturas por etapa')).toBeVisible()
})