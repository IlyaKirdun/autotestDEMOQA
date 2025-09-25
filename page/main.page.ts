import {Page} from "@playwright/test"
import {ElementsOnMainPage} from "utils/types"

export default class MainPage {
  page: Page

  constructor(page: Page) {
    this.page = page
  }

  private async navigateToPageByUrl(page: Page, url: string): Promise<void> {
    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    })

    if (response === null || !response.ok()) {
      throw new Error(`Ошибка навигации: статус ${response?.status() || 'null'}`)
    }
  }

  async navigateToMainPage(url: string = '/'): Promise<Page> {
    const maxAttempts: number = 5
    const currentPage: Page = this.page

    for (let attempt: number = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        await this.navigateToPageByUrl(currentPage, url)
        return currentPage
      } catch (error) {
        console.error(`Попытка ${attempt} не удалась:`, error)

        // Создаем новую страницу для следующей попытки
        const newPage: Page = await this.page.context().newPage()

        try {
          await this.navigateToPageByUrl(newPage, url)
          await currentPage.close()
          this.page = newPage
          return this.page
        } catch {
          await newPage.close()
        }
      }
    }

    throw new Error(`Не удалось загрузить страницу после ${maxAttempts} попыток`)
  }

  async clickOnElement(elementName: ElementsOnMainPage): Promise<void> {
    await this.page.locator(`//h5[text()="${elementName}"]`).click()
  }
}