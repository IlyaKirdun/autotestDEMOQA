import {test, Page} from "@playwright/test";
import MainPage from "../page/main.page";
import NavigationBar from "../utils/components/navigationBar";
import ButtonPage from "../page/button.page";
import {assertByState, removeAds} from "../utils/functions";

test.describe('Проверка функциональности на странице "Web Tables', () => {
  let updatedPage: Page
  let mainPage: MainPage
  let navigationBar: NavigationBar
  let buttonPage: ButtonPage

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page)

    const newPage = await mainPage.navigateToMainPage()
    if (newPage !== page) { page = newPage }

    updatedPage = page
    buttonPage = new ButtonPage(page)
    navigationBar = new NavigationBar(page)

    await removeAds(page)
    await mainPage.clickOnElement('Elements')
    await navigationBar.clickElementInNavigationBar('Buttons')
    await removeAds(page)
  })

  test('CASE_1: Проверка функционала кнопки "Double Click Me".', async () => {
    await test.step('Нажимаем левой кнопкой два раза по кнопке "Double Click Me".', async () => {
      await buttonPage.clickButtonByState(buttonPage.doubleClickButton, 'dblclick')
    })

    await test.step('Проверяем наличие сообщения "You have done a double click".', async () => {
      await buttonPage.verifyMatchButtonMessage('double')
    })
  })

  test('CASE_2: Проверка функционала кнопки "Right Click Me".', async () => {
    await test.step('Нажимаем правой кнопкой по кнопке "Right Click Me".', async () => {
      await buttonPage.clickRightClickButton()
    })

    await test.step('Проверяем наличие сообщения "You have done a right click".', async () => {
      await buttonPage.verifyMatchButtonMessage('right')
    })
  })

  test('CASE_3: Проверка функционала кнопки "Click Me".', async () => {
    let initialButtonId: string = ''
    let actualButtonId: string = ''

    await test.step('Сохраняем значение аргумента "id" у кнопки "Click Me".', async () => {
      initialButtonId = await buttonPage.getCurrentDynamicButtonId()
    })

    await test.step('Обновляем страницу', async () => {
      await updatedPage.reload()
    })

    await test.step('Сравниваем значение аргумента "id" у кнопки "Click Me" с сохранённым.', async () => {
      actualButtonId = await buttonPage.getCurrentDynamicButtonId()
      await assertByState(initialButtonId, actualButtonId, 'notMatch')
    })

    await test.step('Нажимаем левой кнопкой два раза по кнопке "Click Me".', async () => {
      await buttonPage.clickButtonByState(buttonPage.dynamicButton, 'click')
    })

    await test.step('Проверяем наличие сообщения "You have done a dynamic click".', async () => {
      await buttonPage.verifyMatchButtonMessage('dynamic')
    })
  })

  test('CASE_4: Проверка сохранения отображения сообщения при нажатии кнопок: "Right Click Me", "Click Me", "Double Click Me".', async () => {
    await test.step('Нажимаем правой кнопкой по кнопке "Right Click Me".', async () => {
      await buttonPage.clickRightClickButton()
    })

    await test.step('Проверяем наличие сообщения "You have done a right click".', async () => {
      await buttonPage.verifyMatchButtonMessage('right')
    })

    await test.step('Нажимаем правой кнопкой по кнопке "Click Me".', async () => {
      await buttonPage.clickButtonByState(buttonPage.dynamicButton, 'click')
    })

    await test.step('Проверяем наличие сообщений: "You have done a dynamic click" и "You have done a right click".', async () => {
      await buttonPage.verifyMatchButtonMessage('dynamic')
      await buttonPage.verifyMatchButtonMessage('right')
    })

    await test.step('Нажимаем правой кнопкой по кнопке "Click Me".', async () => {
      await buttonPage.clickButtonByState(buttonPage.doubleClickButton, 'dblclick')
    })

    await test.step('Проверяем наличие сообщений: "You have done a dynamic click" и "You have done a right click".', async () => {
      await buttonPage.verifyMatchButtonMessage('dynamic')
      await buttonPage.verifyMatchButtonMessage('right')
      await buttonPage.verifyMatchButtonMessage('double')

    })
  })
})