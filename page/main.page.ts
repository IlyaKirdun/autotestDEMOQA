import {Page} from "@playwright/test"
import {ElementsOnMainPage} from "../utils/types"

export default class MainPage {
  page: Page

  constructor(page: Page) {
    this.page = page
  }

  private async attemptNavigate(page: Page, url: string): Promise<boolean> {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded' })
    return response !== null && !this.isErrorCode(response.status())
  }

  private isErrorCode(statusCode: number): boolean {
    return [500, 502].includes(statusCode)
  }

  async navigateToMainPage(): Promise<Page> {
    const maxAttempts = 5

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      try {
        // Первая попытка на текущей странице
        if (await this.attemptNavigate(this.page, '/')) {
          return this.page
        }

        // Вторая попытка на новой странице
        const newPage = await this.page.context().newPage()
        try {
          if (await this.attemptNavigate(newPage, '/')) {
            await this.page.close()
            this.page = newPage
            return this.page
          }
        } finally {
          await newPage.close()
        }
      } catch (error) {
        console.error(`Попытка ${attempt + 1} завершилась ошибкой:`, error)
      }
    }

    throw new Error('Не удалось загрузить страницу после 5 попыток.')
  }

  async clickOnElement(elementName: ElementsOnMainPage): Promise<void> {
    await this.page.locator(`//h5[text()="${elementName}"]`).click()
  }
}