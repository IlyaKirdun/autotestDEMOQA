import {expect,Page, test} from "@playwright/test"
import MainPage from "../page/main.page"
import NavigationBar from "../utils/components/navigationBar"
import DynamicProperties from "../page/dynamicProperties.page"
import {removeAds} from "../utils/functions"

test.describe('Проверка функциональности на странице "Dynamic Properties"', () => {
  let updatedPage: Page
  let mainPage: MainPage
  let navigationBar: NavigationBar
  let dynamicProperties: DynamicProperties

  test.beforeEach(async ({page}) => {
    mainPage = new MainPage(page)

    const newPage = await mainPage.navigateToMainPage()
    if (newPage !== page) { page = newPage }

    updatedPage = page
    navigationBar = new NavigationBar(page)
    dynamicProperties = new DynamicProperties(page)

    await removeAds(page)
    await mainPage.clickOnElement('Elements')
    await navigationBar.clickElementInNavigationBar('Dynamic Properties')
    await removeAds(page)
  })

  test('CASE_1: Проверяем текст с изменяемым ID', async () => {
    let initialTextId: string | null = ''

    await test.step(`Сохраняем ID текста в ${initialTextId}.`, async () => {
      initialTextId = await dynamicProperties.getTextId()
    })

    await test.step('Обновляем страницу.', async () => {
      await updatedPage.reload()
    })

    await test.step(`Получаем ID и сравниваем с ${initialTextId}.`, async () => {
      expect(await dynamicProperties.getTextId()).not.toBe(initialTextId)
    })
  })

  test('CASE_2: Проверяем изменение состояния кнопки "Will enable 5 seconds".', async () => {

    await test.step('Pre-conditions', async () => {
      await test.step('Проверяем что кнопка не активна.', async () => {
        await dynamicProperties.verifyButtonState('toBeDisabled')
      })
    })

    await test.step('Ожидаем изменение состояния кнопки через 5 секунд.', async () => {
      await dynamicProperties.verifyButtonState('toBeEnabled', 5000)
    })
  })

  test('CASE_3: Проверяем изменение цвета текста у кнопки "Color Change".', async () => {

    await test.step('Pre-conditions', async () => {
      await test.step('Проверяем что цвет текста у кнопки "Белый".', async () => {
        await dynamicProperties.verifyButtonColor('white')
      })
    })

    await test.step('Ожидаем изменение цвета текста на "Красный" у кнопки через 5 секунд.', async () => {
      await dynamicProperties.verifyButtonColor('red', 5000)
    })
  })

  test('CASE_4: Проверяем состояния кнопки "Visible After 5 Seconds".', async () => {

    await test.step('Pre-conditions', async () => {
      await test.step('Проверяем что кнопка не отображается.', async () => {
        await dynamicProperties.verifyButtonVisibility('toBeHidden')
      })
    })

    await test.step('Ожидаем отображение кнопки через 5 секунд.', async () => {
      await dynamicProperties.verifyButtonVisibility('toBeVisible', 5000)
    })
  })
})
