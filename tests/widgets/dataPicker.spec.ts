import {expect, test} from "@playwright/test"
import MainPage from "../../page/main.page"
import DatePicker from "../../utils/components/dataPicker.page";
import {assertByState, removeAds} from "../../utils/functions";
import NavigationBar from "../../utils/components/navigationBar";
import {MonthList} from "../../utils/types";

test.describe('Проверка функциональности на странице "Date Picker', () => {
  let mainPage: MainPage
  let navigationBar: NavigationBar
  let datePicker: DatePicker

  test.beforeEach(async ({page}) => {
    mainPage = new MainPage(page)

    const newPage = await mainPage.navigateToMainPage()
    if (newPage !== page) { page = newPage }

    navigationBar = new NavigationBar(page)
    datePicker = new DatePicker(page)

    await removeAds(page)
    await mainPage.clickOnElement('Widgets')
    await navigationBar.clickElementInNavigationBar('Date Picker')
    await removeAds(page)
  })

  test('CASE_1: Проверка даты из поля виджета Select date.', async () => {
    await test.step('Сравниваю дату виджета "Select Date" с сегодняшней.', async () => {
      expect(await datePicker.selectDateInput.getAttribute('value')).toBe(datePicker.getCurrentDateForSelectDate())
    })
  })

  test('CASE_2: Проверяем функционал ручного ввода даты в "Select Date".', async () => {
    const date: string = '1 1 2011'
    const expectedDate: string = '01/01/2011'
    const day: number = 1
    const stringMonth: MonthList = 'January'
    const numberMonth: number = 1
    const year: string = '2011'

    await test.step('Нажимаем на виджет "Select Date".', async () => {
      await datePicker.selectDateInput.click()
    })

    await test.step('Проверяем что модальное окно открылось.', async () => {
      await datePicker.verifyDataPickerTabByState('datePickerMonthYear', 'toBeVisible')
    })

    await test.step('Очищаем поле ввода.', async () => {
      await datePicker.selectDateInput.fill('')
    })

    await test.step(`Вводим дату из ${date}`, async () => {
      await datePicker.selectDateInput.fill(date)
    })

    await test.step('Проверяем правильное отображение в поле ввода.', async () => {
      expect(date).toBe(await datePicker.selectDateInput.getAttribute('value'))
    })

    await test.step('Проверяем корректное отображение месяца в селект меню "Month".', async () => {
      await datePicker.verifyMonthOrYearInSelectMenu("month", `${numberMonth - 1}`)
    })

    await test.step('Проверяем корректное отображение года в селект меню "Year".', async () => {
      await datePicker.verifyMonthOrYearInSelectMenu("year", year)
    })

    await test.step('Проверяем корректное отображение месяца и года в шапке пагинации.', async () => {
      expect(`${stringMonth} ${year}`).toBe(await datePicker.monthYearNavigationOutput.textContent())
    })

    await test.step('Проверяем выделение дня в календаре.', async () => {
      await datePicker.verifyDayStatus(day)
    })

    await test.step('Нажимаем клавишу "Ввод".', async () => {
      await datePicker.clickEnterOnKeyboard('selectDateInput')
    })

    await test.step('Проверяем что модальное окно закрылось.', async () => {
      await datePicker.verifyDataPickerTabByState('datePickerMonthYear', 'toBeHidden')
    })

    await test.step('Проверяем корректное отображение даты.', async () => {
      expect(await datePicker.selectDateInput.inputValue()).toBe(expectedDate)
    })
  })

  test('CASE_3: Проверка функционала выбора месяца и года через селект меню в "Select Date".', async () => {
    const stringMonth: MonthList = 'January'
    const numberMonth: number = 1
    const year: number = 2011

    await test.step('Pre-condition', async () => {
      await test.step('Нажимаем на виджет "Select date".', async () => {
        await datePicker.selectDateInput.click()
      })

      await test.step('Проверяем что модальное окно открылось.', async () => {
        await datePicker.verifyDataPickerTabByState('datePickerMonthYear', 'toBeVisible')
      })
    })

    await test.step(`Выбираем ${stringMonth} в выпадающем меню "Month".`, async () => {
      await datePicker.selectMonthOrYearInSelectMenu('month', stringMonth)
    })

    await test.step('Проверяем корректное отображение месяца в селект меню "Month".', async () => {
      await datePicker.verifyMonthOrYearInSelectMenu("month", `${numberMonth - 1}`)
    })

    await test.step(`Выбираем ${year} в выпадающем меню "Year".`, async () => {
      await datePicker.selectMonthOrYearInSelectMenu('year', year)
    })

    await test.step('Проверяем корректное отображение года в селект меню "Year".', async () => {
      await datePicker.verifyMonthOrYearInSelectMenu("year", `${year}`)
    })

    await test.step('Проверяем корректное отображение месяца и года в шапке пагинации.', async () => {
      expect(`${stringMonth} ${year}`).toBe(await datePicker.monthYearNavigationOutput.textContent())
    })
  })

  test('CASE_4: Проверяем пагинацию дней месяца в "Select Date".', async () => {
    let initialMonth: string = ''
    let currentMonth: string

    await test.step('Pre-condition', async () => {
      await test.step('Нажимаем на виджет "Date And Time".', async () => {
        await datePicker.selectDateInput.click()
      })

      await test.step('Проверяем что модальное окно открылось.', async () => {
        await datePicker.verifyDataPickerTabByState('datePickerMonthYear', 'toBeVisible')
      })
    })

    await test.step(`Сохраняем текущий месяц в ${initialMonth}.`, async () => {
      initialMonth = await datePicker.getCurrentMonthOrYearInSelectMenu('month')
    })

    await test.step('Нажимаем кнопку "Предыдущий месяц".', async () => {
      await datePicker.clickNavigationMonthButtonByAction('Previous')
    })

    await test.step(`Сравниваем текущий месяц с ${initialMonth}.`, async () => {
      currentMonth = await datePicker.getCurrentMonthOrYearInSelectMenu('month')
      await assertByState(initialMonth, currentMonth, 'notMatch')
    })

    await test.step(`Сохраняем текущий месяц в ${initialMonth}.`, async () => {
      initialMonth = await datePicker.getCurrentMonthOrYearInSelectMenu('month')
    })

    await test.step('Нажимаем кнопку "Следующий месяц".', async () => {
      await datePicker.clickNavigationMonthButtonByAction('Next')
    })

    await test.step(`Сравниваем текущий месяц с ${initialMonth}.`, async () => {
      await assertByState(initialMonth, await datePicker.getCurrentMonthOrYearInSelectMenu('month'), 'notMatch')
    })
  })

  test('CASE_5: Проверяем выбор полной даты в "Select Date".', async () => {
    const stringMonth: MonthList = 'August'
    const numberMonth: number = 8
    const day: number = 25
    const year: number = 2030
    const extendedDate: string = '08/25/2030'

    await test.step('Нажимаем на виджет "Select date".', async () => {
      await datePicker.selectDateInput.click()
    })

    await test.step('Проверяем что модальное окно открылось.', async () => {
      await datePicker.verifyDataPickerTabByState('datePickerMonthYear', 'toBeVisible')
    })

    await test.step(`Выбираем ${stringMonth} в выпадающем меню "Month".`, async () => {
      await datePicker.selectMonthOrYearInSelectMenu('month', stringMonth)
    })

    await test.step('Проверяем корректное отображение месяца в селект меню "Month".', async () => {
      await datePicker.verifyMonthOrYearInSelectMenu('month', `${numberMonth - 1}`)
    })

    await test.step(`Выбираем ${year} в выпадающем меню "Year".`, async () => {
      await datePicker.selectMonthOrYearInSelectMenu('year', year)
    })

    await test.step('Проверяем корректное отображение года в селект меню "Year".', async () => {
      await datePicker.verifyMonthOrYearInSelectMenu('year', `${year}`)
    })

    await test.step('Проверяем корректное отображение месяца и года в шапке пагинации.', async () => {
      expect(`${stringMonth} ${year}`).toBe(await datePicker.monthYearNavigationOutput.textContent())
    })

    await test.step(`Выбираем ${day}.`, async () => {
      await datePicker.selectDayByNumber(day)
    })

    await test.step('Проверяем что модальное окно закрылось.', async () => {
      await datePicker.verifyDataPickerTabByState('datePickerMonthYear', 'toBeHidden')
    })

    await test.step(`Сравниваем поле виджета "Select Date" c ${extendedDate}`, async () => {
      expect(extendedDate).toBe(await datePicker.selectDateInput.inputValue())
    })
  })

  test('CASE_6: Проверка даты из поля виджета "Data And Time".', async () => {
    await test.step(`Сравниваем дату виджета "Data And Time" с сегодняшней.`, async () => {
      expect(await datePicker.dateAndTimeInput.getAttribute('value')).toBe(datePicker.getCurrentDateForDateAndTime())
    })
  })

  test('CASE_7: Проверяем функционал выбора месяца и года через выпадающие меню виджета "Date And Time".', async () => {
    const month: MonthList = 'May'
    const year: number = 2030

    await test.step('Pre-condition', async () => {
      await test.step('Нажимаем на виджет "Date And Time".', async () => {
        await datePicker.dateAndTimeInput.click()
      })

      await test.step('Проверяем что модальное окно открылось.', async () => {
        await datePicker.verifyDataPickerTabByState('dateAndTimePicker', 'toBeVisible')
      })
    })

    await test.step(`Выбираем ${month} в выпадающем меню "Month".`, async () => {
      await datePicker.selectMonthOrYearInDropdownMenu('month', month)
    })

    await test.step('Проверяем корректное отображение месяца в выпадающем меню "Month".', async () => {
      await datePicker.verifyMonthOrYearInDropdownMenu('month', month)
    })

    await test.step(`Выбираем ${year} в выпадающем меню "Year".`, async () => {
      await datePicker.selectMonthOrYearInDropdownMenu('year', year)
    })

    await test.step('Проверяем корректное отображение года в выпадающем меню "Year".', async () => {
      await datePicker.verifyMonthOrYearInDropdownMenu('year', year)
    })

    await test.step('Проверяем корректное отображение месяца и года в шапке пагинации.', async () => {
      expect(`${month} ${year}`).toBe(await datePicker.monthYearNavigationOutput.textContent())
    })
  })

  test('CASE_8: Проверяем пагинацию дней месяца виджета "Data And Time".', async () => {
    let initialMonth: string = ''
    let currentMonth: string = ''

    await test.step('Pre-condition', async () => {
      await test.step('Нажимаем на виджет "Date And Time".', async () => {
        await datePicker.dateAndTimeInput.click()
      })

      await test.step('Проверяем что модальное окно открылось.', async () => {
        await datePicker.verifyDataPickerTabByState('dateAndTimePicker', 'toBeVisible')
      })
    })

    await test.step(`Сохраняем текущий месяц в ${initialMonth}.`, async () => {
      initialMonth = await datePicker.getCurrentMonthOrYearInDropdownMenu('month')
    })

    await test.step('Нажимаем кнопку "Предыдущий месяц".', async () => {
      await datePicker.clickNavigationMonthButtonByAction('Previous')
    })

    await test.step(`Сравниваем текущий месяц с ${initialMonth}.`, async () => {
      currentMonth = await datePicker.getCurrentMonthOrYearInDropdownMenu('month')
      await assertByState(initialMonth, currentMonth, 'notMatch')
    })

    await test.step(`Сохраняем текущий месяц в ${initialMonth}.`, async () => {
      initialMonth = await datePicker.getCurrentMonthOrYearInDropdownMenu('month')
    })

    await test.step('Нажимаем кнопку "Следующий месяц".', async () => {
      await datePicker.clickNavigationMonthButtonByAction('Next')
    })

    await test.step(`Сравниваем текущий месяц с ${initialMonth}.`, async () => {
      currentMonth = await datePicker.getCurrentMonthOrYearInDropdownMenu('month')
      await assertByState(initialMonth, currentMonth, 'notMatch')
    })
  })

  test('CASE_9: Проверка выбора дня месяца виджета "Date And Time".', async () => {
    let initialDate: string = ''
    let currentDate: string = ''
    const day: number = 15

    await test.step(`Сохраняем текущую дату в ${currentDate}`, async () => {
      initialDate = await datePicker.dateAndTimeInput.inputValue()
    })

    await test.step('Нажимаем на виджет "Date And Time".', async () => {
      await datePicker.dateAndTimeInput.click()
    })

    await test.step('Проверяем что модальное окно открылось.', async () => {
      await datePicker.verifyDataPickerTabByState('dateAndTimePicker', 'toBeVisible')
    })

    await test.step(`Выбираем ${day}.`, async () => {
      await datePicker.selectDayByNumber(day)
    })

    await test.step(`Проверка изменения цвета ${day}.`, async () => {
      await datePicker.verifyDayStatus(day)
    })

    await test.step(`Сравниваем дату в поле виджета с ${currentDate}.`, async () => {
      currentDate = await datePicker.dateAndTimeInput.inputValue()

      await assertByState(currentDate, initialDate, 'notMatch')
    })
  })

  test('CASE_10: Проверка функционала выбора даты виджета "Data And Time".', async () => {
    const expectedDate: string = 'June 1, 2022 1:00 PM'
    const day: number = 1
    const month: MonthList = 'June'
    const year: number = 2022
    const time: string = '13:00'

    await test.step('Нажимаем на виджет "Date And Time".', async () => {
      await datePicker.dateAndTimeInput.click()
    })

    await test.step('Проверяем что модальное окно открылось.', async () => {
      await datePicker.verifyDataPickerTabByState('dateAndTimePicker', 'toBeVisible')
    })

    await test.step(`Выбираем ${month} в выпадающем меню "Month".`, async () => {
      await datePicker.selectMonthOrYearInDropdownMenu('month', month)
    })

    await test.step('Проверяем корректное отображение месяца в выпадающем меню "Month".', async () => {
      await datePicker.verifyMonthOrYearInDropdownMenu('month', month)
    })

    await test.step(`Выбираем ${year} в выпадающем меню "Year".`, async () => {
      await datePicker.selectMonthOrYearInDropdownMenu('year', year)
    })

    await test.step('Проверяем корректное отображение года в выпадающем меню "Year".', async () => {
      await datePicker.verifyMonthOrYearInDropdownMenu('year', year)
    })

    await test.step('Проверяем корректное отображение месяца и года в шапке пагинации.', async () => {
      expect(`${month} ${year}`).toBe(await datePicker.monthYearNavigationOutput.textContent())
    })

    await test.step(`Выбираем ${day}.`, async () => {
      await datePicker.selectDayByNumber(day)
    })

    await test.step(`Проверка выбора ${day} в календаре.`, async () => {
      await datePicker.verifyDayStatus(day)
    })

    await test.step(`Выбираем ${time} в списке времени.`, async () => {
      await datePicker.selectTimeByNumber(time)
    })

    await test.step('Проверяем что модальное окно закрылось.', async () => {
      await datePicker.verifyDataPickerTabByState('dateAndTimePicker', 'toBeHidden')
    })

    await test.step('Проверяем корректное отображение даты.', async () => {
      expect(await datePicker.dateAndTimeInput.inputValue()).toBe(expectedDate)
    })

    await test.step('Нажимаем на виджет "Date And Time".', async () => {
      await datePicker.dateAndTimeInput.click()
    })

    await test.step(`Проверка изменения цвета ${time}`, async () => {
      await datePicker.verifyTimeStatus(time)
    })
  })

  test('CASE_11: Проверка ручного ввода даты виджета "Date And Time".', async () => {
    const date: string = '4 20,2015 13:00'
    const expectedDate: string = 'April 20, 2015 1:00 PM'
    const time: string = '13:00'
    const day: number = 20
    const month: MonthList = 'April'
    const year: number = 2015

    await test.step('Нажимаем на виджет "Date And Time".', async () => {
      await datePicker.dateAndTimeInput.click()
    })

    await test.step('Проверяем что модальное окно открылось.', async () => {
      await datePicker.verifyDataPickerTabByState('dateAndTimePicker', 'toBeVisible')
    })

    await test.step('Очищаем поле ввода.', async () => {
      await datePicker.dateAndTimeInput.fill('')
    })

    await test.step(`Вводим дату из ${date}`, async () => {
      await datePicker.dateAndTimeInput.fill(date)
    })

    await test.step('Проверяем правильное отображение в поле ввода.', async () => {
      expect(date).toBe(await datePicker.dateAndTimeInput.getAttribute('value'))
    })

    await test.step('Проверяем корректное отображение месяца в выпадающем меню "Month".', async () => {
      await datePicker.verifyMonthOrYearInDropdownMenu('month', month)
    })

    await test.step('Проверяем корректное отображение года в выпадающем меню "Year".', async () => {
      await datePicker.verifyMonthOrYearInDropdownMenu('year', year)
    })

    await test.step('Проверяем корректное отображение месяца и года в шапке пагинации.', async () => {
      expect(`${month} ${year}`).toBe(await datePicker.monthYearNavigationOutput.textContent())
    })

    await test.step(`Проверяем выделение ${day}.`, async () => {
      await datePicker.verifyDayStatus(day)
    })

    await test.step(`Проверяем выделение ${time}.`, async () => {
      await datePicker.verifyTimeStatus(time)
    })

    await test.step('Нажимаем клавишу "Ввод".', async () => {
      await datePicker.clickEnterOnKeyboard('dateAndTimeInput')
    })

    await test.step('Проверяем что модальное окно закрылось.', async () => {
      await datePicker.verifyDataPickerTabByState('dateAndTimePicker', 'toBeHidden')
    })

    await test.step('Проверяем корректное отображение даты.', async () => {
      expect(await datePicker.dateAndTimeInput.inputValue()).toBe(expectedDate)
    })
  })

  test('CASE_12: Проверка навигации в выпадающем меню "Год" в "Date And Time".', async () => {
    let year: string | null = ''

    await test.step('Pre-condition', async () => {
      await test.step('Нажимаем на виджет "Date And Time".', async () => {
        await datePicker.dateAndTimeInput.click()
      })

      await test.step('Проверяем что модальное окно открылось.', async () => {
        await datePicker.verifyDataPickerTabByState('dateAndTimePicker', 'toBeVisible')
      })
    })

    await test.step('Открываем выпадающее меню "Year"', async () => {
      await datePicker.clickMonthOrYearDropdownMenu('year')
    })

    await test.step(`Сохраняем последний год из списка в ${year}`, async () => {
      year = await datePicker.lastYearInDropdownMenu.textContent()
    })

    await test.step('Нажимаем кнопку "Следующий год"', async () => {
      await datePicker.clickNavigationYearDropdownMenuButtonByAction('next')
    })

    await test.step(`Сравниваем последний год из списка с ${year}`, async () => {
      const currentYear: string | null = await datePicker.lastYearInDropdownMenu.textContent()
      await assertByState(currentYear,year,'notMatch')
    })

    await test.step(`Сохраняем последний год из списка в ${year}`, async () => {
      year = await datePicker.lastYearInDropdownMenu.textContent()
    })

    await test.step('Нажимаем кнопку "Предыдущий год"', async () => {
      await datePicker.clickNavigationYearDropdownMenuButtonByAction('previous')
    })

    await test.step(`Сравниваем последний год из списка с ${year}`, async () => {
      const currentYear: string | null = await datePicker.lastYearInDropdownMenu.textContent()
      await assertByState(currentYear,year,'notMatch')
    })
  })
})