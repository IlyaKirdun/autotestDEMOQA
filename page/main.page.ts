import {Page} from "@playwright/test"
import {ElementsOnMainPage} from "utils/types"

export default class MainPage {
  page: Page

  constructor(page: Page) {
    this.page = page
  }

  private async attemptNavigate(page: Page, url: string): Promise<void> {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded' })

    if (!response || this.isErrorCode(response.status())) {
      throw new Error(`Ошибка навигации: статус ${response?.status() || 'null'}`);
    }
    // return response !== null && !this.isErrorCode(response.status())
  }

  private isErrorCode(statusCode: number): boolean {
    return [500, 502].includes(statusCode)
  }

  async navigateToMainPage(): Promise<Page> {
    const maxAttempts: number = 5
    const currentPage: Page = this.page

    for (let attempt: number = 0; attempt < maxAttempts; attempt += 1) {
      try {
        // Попытка навигации на текущей странице
        await this.attemptNavigate(currentPage, '/')
        return currentPage
      } catch (primaryError) {
        console.error(`${attempt + 1} попытка с основной страницей не удалась:`, primaryError)

        // Попытка навигации с новой страницей
        const newPage: Page = await this.page.context().newPage()

        try {
          await this.attemptNavigate(newPage, '/')
          await currentPage.close()
          this.page = newPage
          return this.page
        } catch (error) {
          console.error(`${attempt + 1} попытка с новой страницей не удалась:`, error)
          await newPage.close()
        }
      }
    }

    throw new Error('Не удалось загрузить страницу после 5 попыток.')
  }

  async clickOnElement(elementName: ElementsOnMainPage): Promise<void> {
    await this.page.locator(`//h5[text()="${elementName}"]`).click()
  }
}