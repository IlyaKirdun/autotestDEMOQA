import {test, Page} from "@playwright/test";
import MainPage from "../page/main.page";
import NavigationBar from "../utils/components/navigationBar";
import LinksPage from "../page/links.page";
import {assertByState, removeAds} from "../utils/functions";
import {locatorLinkNames} from "../utils/types";

test.describe('Проверка функциональности на странице "Links', () => {
    let updatedPage: Page
    let mainPage: MainPage
    let navigationBar: NavigationBar
    let linksPage: LinksPage

    test.beforeEach(async ({ page , context}) => {
        mainPage = new MainPage(page)

        const newPage = await mainPage.navigateToMainPage()
        if (newPage !== page) { page = newPage }

        updatedPage = page
        navigationBar = new NavigationBar(page)
        linksPage = new LinksPage(page, context)

        await removeAds(page)
        await mainPage.clickOnElement('Elements')
        await navigationBar.clickElementInNavigationBar('Links')
        await removeAds(page)
    })

    test('CASE_1: Проверяем функционал ссылки "Home".', async () => {
        await test.step('Переходим по ссылке "Home", ожидаем новую вкладку с url "https://demoqa.com".', async () => {
            await linksPage.clickAndVerifyLinkByName('simpleLink')
        })
    })

    test('CASE_2: Проверяем функционал динамической ссылки "Home".', async () => {
        let initialDynamicLink = ''
        let actualDynamicLink = ''

        await test.step(`Сохраняем значение динамической ссылки "Home" в ${initialDynamicLink}.`, async () => {
            initialDynamicLink = await linksPage.getDynamicLinkInputValue()
        })

        await test.step('Обновляем страницу.', async () => {
            await updatedPage.reload()
        })

        await test.step(`Сохраняем значение динамической ссылки "Home" в ${actualDynamicLink}.`, async () => {
            actualDynamicLink = await linksPage.getDynamicLinkInputValue()
        })

        await test.step(`Сравниваем переменные ${initialDynamicLink} и ${actualDynamicLink}.`, async () => {
            await assertByState(initialDynamicLink, actualDynamicLink, 'notMatch')
        })

        await test.step('Переходим по динамической ссылке "Home", ожидаем новую вкладку с url "https://demoqa.com".', async () => {
            await linksPage.clickAndVerifyLinkByName('dynamicLink')
        })
    })

    test('CASE_3: Проверяем функционал ссылки "Created".', async () => {
        const statusCode = 201
        const statusMessage = 'Created'

        await test.step('Нажимаем на ссылку "Created".', async () => {
            await linksPage.clickLinkByName('created')
        })

        await test.step('Проверяем сообщение.', async () => {
            await linksPage.verifyLinkMessage('created')
        })

        await test.step('Проверяем ответ на запрос.', async () => {
            await linksPage.verifyApiResponse(statusCode, statusMessage)
        })
    })

    test('CASE_4: Проверяем функционал ссылки "No Content".', async () => {
        const statusCode = 204
        const statusMessage = 'No Content'

        await test.step('Нажимаем на ссылку "No Content".', async () => {
            await linksPage.clickLinkByName('no-content')
        })

        await test.step('Проверяем сообщение.', async () => {
            await linksPage.verifyLinkMessage('no-content')
        })

        await test.step('Проверяем ответ на запрос.', async () => {
            await linksPage.verifyApiResponse(statusCode, statusMessage)
        })
    })

    test('CASE_5: Проверяем функционал ссылки "Moved".', async () => {
        const statusCode = 301
        const statusMessage = 'Moved'

        await test.step('Нажимаем на ссылку "Moved".', async () => {
            await linksPage.clickLinkByName('moved')
        })

        await test.step('Проверяем сообщение.', async () => {
            await linksPage.verifyLinkMessage('moved')
        })

        await test.step('Проверяем ответ на запрос.', async () => {
            await linksPage.verifyApiResponse(statusCode, statusMessage)
        })
    })

    test('CASE_6: Проверяем функционал ссылки "Bad Request".', async () => {
        const statusCode = 400
        const statusMessage = 'Bad Request'

        await test.step('Нажимаем на ссылку "Bad Request".', async () => {
            await linksPage.clickLinkByName('bad-request')
        })

        await test.step('Проверяем сообщение.', async () => {
            await linksPage.verifyLinkMessage('bad-request')
        })

        await test.step('Проверяем ответ на запрос.', async () => {
            await linksPage.verifyApiResponse(statusCode, statusMessage)
        })
    })

    test('CASE_7: Проверяем функционал ссылки "Unauthorized".', async () => {
        const statusCode = 401
        const statusMessage = 'Unauthorized'

        await test.step('Нажимаем на ссылку "Unauthorized".', async () => {
            await linksPage.clickLinkByName('unauthorized')
        })

        await test.step('Проверяем сообщение.', async () => {
            await linksPage.verifyLinkMessage('unauthorized')
        })

        await test.step('Проверяем ответ на запрос.', async () => {
            await linksPage.verifyApiResponse(statusCode, statusMessage)
        })
    })

    test('CASE_8: Проверяем функционал ссылки "Forbidden".', async () => {
        const statusCode = 403
        const statusMessage = 'Forbidden'

        await test.step('Нажимаем на ссылку "Forbidden".', async () => {
            await linksPage.clickLinkByName('forbidden')
        })

        await test.step('Проверяем сообщение.', async () => {
            await linksPage.verifyLinkMessage('forbidden')
        })

        await test.step('Проверяем ответ на запрос.', async () => {
            await linksPage.verifyApiResponse(statusCode, statusMessage)
        })
    })

    test('CASE_9: Проверяем функционал ссылки "Not Found".', async () => {
        const statusCode = 404
        const statusMessage = 'Not Found'

        await test.step('Нажимаем на ссылку "Not Found".', async () => {
            await linksPage.clickLinkByName('invalid-url')
        })

        await test.step('Проверяем сообщение.', async () => {
            await linksPage.verifyLinkMessage('invalid-url')
        })

        await test.step('Проверяем ответ на запрос.', async () => {
            await linksPage.verifyApiResponse(statusCode, statusMessage)
        })
    })

    test('CASE_10: Проверяем функционал смены сообщения запроса.', async () => {
        let initialLinkMessage = ''
        let actualLinkMessage = ''
        const initialLink: locatorLinkNames = 'created'
        const actualLink: locatorLinkNames = 'moved'


        await test.step(`Нажимаем на ссылку ${initialLink}.`, async () => {
            await linksPage.clickLinkByName(initialLink)

        })

        await test.step(`Сохраняем сообщение в ${initialLinkMessage}.`, async () => {
            initialLinkMessage = await linksPage.getLinkMessage()
        })

        await test.step(`Нажимаем на ссылку ${actualLink}.`, async () => {
            await linksPage.clickLinkByName(actualLink)
        })

        await test.step(`Сохраняем сообщение в ${actualLinkMessage}.`, async () => {
            actualLinkMessage = await linksPage.getLinkMessage()
        })

        await test.step(`Сравниваем переменные ${initialLinkMessage} и ${actualLinkMessage}.`, async () => {
            console.log(initialLinkMessage, actualLinkMessage)
            await assertByState(initialLinkMessage, actualLinkMessage, 'notMatch')
        })
    })
})