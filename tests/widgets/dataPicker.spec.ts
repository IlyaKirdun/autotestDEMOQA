import {expect, Page, test} from "@playwright/test"
import MainPage from "page/main.page"
import DatePicker from "utils/components/dataPicker.page";
import {assertByState, removeAds} from "utils/functions";
import NavigationBar from "utils/components/navigationBar";
import {DateAndTimeTestData, SelectDateTestData} from "utils/types";

test.describe('Проверка функциональности на странице "Date Picker', () => {
  let mainPage: MainPage
  let navigationBar: NavigationBar
  let datePicker: DatePicker

  const dateAndTimeTestData: DateAndTimeTestData = {
    customDate: '6 1,2022 13:00',
    expectedDate: 'June 1, 2022 1:00 PM',
    day: 1,
    month: 'June',
    year: 2022,
    time: '13:00'
  }
  const selectDateTestData: SelectDateTestData = {
    stringMonth: 'August',
    numberMonth: 8,
    day: 25,
    year: 2030,
    customDate:  '8 25 2030',
    extendedDate: '08/25/2030'
  }

  test.beforeEach(async ({page}) => {
    mainPage = new MainPage(page)

    const newPage: Page = await mainPage.navigateToMainPage()
    if (newPage !== page) { page = newPage }

    navigationBar = new NavigationBar(page)
    datePicker = new DatePicker(page)

    await test.step('Удаляем рекламу на главной странице', async () => {
      await removeAds(page)
    })

    await test.step('Нажимаем кнопку "Widgets"', async () => {
      await mainPage.clickOnElement('Widgets')
    })

    await test.step('Нажимаем кнопку "Date Picker"', async () => {
      await navigationBar.clickElementInNavigationBar('Date Picker')
    })

    await test.step('Удаляем рекламу на странице "Date Picker"', async () => {
      await removeAds(page)
    })
  })

  test('CASE_1: Проверка даты из поля виджета Select date.', async () => {
    await test.step('Сравниваю дату виджета "Select Date" с сегодняшней.', async () => {
      expect(await datePicker.selectDateInput.getAttribute('value')).toBe(datePicker.getCurrentDateForSelectDate())
    })
  })

  test('CASE_2: Проверяем функционал ручного ввода даты в "Select Date".', async () => {
    await test.step('Pre-conditions', async () => {
      await test.step('Нажимаем на виджет "Select Date".', async () => {
        await datePicker.selectDateInput.click()
      })

      await test.step('Проверяем что модальное окно открылось.', async () => {
        await datePicker.verifyDataPickerTabByState('datePickerMonthYear', 'toBeVisible')
      })

      await test.step('Очищаем поле ввода.', async () => {
        await datePicker.selectDateInput.fill('')
      })
    })

    await test.step(`Вводим дату из ${selectDateTestData.customDate}`, async () => {
      await datePicker.selectDateInput.fill(selectDateTestData.customDate)
    })

    await test.step('Проверяем правильное отображение в поле ввода.', async () => {
      expect(selectDateTestData.customDate).toBe(await datePicker.selectDateInput.getAttribute('value'))
    })

    await test.step('Проверяем корректное отображение месяца в селект меню "Month".', async () => {
      await datePicker.verifyMonthOrYearInSelectMenu("month", `${selectDateTestData.numberMonth - 1}`)
    })

    await test.step('Проверяем корректное отображение года в селект меню "Year".', async () => {
      await datePicker.verifyMonthOrYearInSelectMenu("year", `${selectDateTestData.year}`)
    })

    await test.step('Проверяем корректное отображение месяца и года в шапке пагинации.', async () => {
      expect(`${selectDateTestData.stringMonth} ${selectDateTestData.year}`).toBe(await datePicker.monthYearNavigationOutput.textContent())
    })

    await test.step('Проверяем выделение дня в календаре.', async () => {
      await datePicker.verifyDayStatus(selectDateTestData.day)
    })

    await test.step('Нажимаем клавишу "Ввод".', async () => {
      await datePicker.clickEnterOnKeyboard('selectDateInput')
    })

    await test.step('Проверяем что модальное окно закрылось.', async () => {
      await datePicker.verifyDataPickerTabByState('datePickerMonthYear', 'toBeHidden')
    })

    await test.step('Проверяем корректное отображение даты.', async () => {
      expect(await datePicker.selectDateInput.inputValue()).toBe(selectDateTestData.extendedDate)
    })
  })

  test('CASE_3: Проверка функционала выбора месяца и года через селект меню в "Select Date".', async () => {
    await test.step('Pre-condition', async () => {
      await test.step('Нажимаем на виджет "Select date".', async () => {
        await datePicker.selectDateInput.click()
      })

      await test.step('Проверяем что модальное окно открылось.', async () => {
        await datePicker.verifyDataPickerTabByState('datePickerMonthYear', 'toBeVisible')
      })
    })

    await test.step(`Выбираем ${selectDateTestData.stringMonth} в выпадающем меню "Month".`, async () => {
      await datePicker.selectMonthOrYearInSelectMenu('month', selectDateTestData.stringMonth)
    })

    await test.step('Проверяем корректное отображение месяца в селект меню "Month".', async () => {
      await datePicker.verifyMonthOrYearInSelectMenu("month", `${selectDateTestData.numberMonth - 1}`)
    })

    await test.step(`Выбираем ${selectDateTestData.year} в выпадающем меню "Year".`, async () => {
      await datePicker.selectMonthOrYearInSelectMenu('year', selectDateTestData.year)
    })

    await test.step('Проверяем корректное отображение года в селект меню "Year".', async () => {
      await datePicker.verifyMonthOrYearInSelectMenu("year", `${selectDateTestData.year}`)
    })

    await test.step('Проверяем корректное отображение месяца и года в шапке пагинации.', async () => {
      expect(`${selectDateTestData.stringMonth} ${selectDateTestData.year}`).toBe(await datePicker.monthYearNavigationOutput.textContent())
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
    await test.step('Pre-conditions', async () => {
      await test.step('Нажимаем на виджет "Select date".', async () => {
        await datePicker.selectDateInput.click()
      })

      await test.step('Проверяем что модальное окно открылось.', async () => {
        await datePicker.verifyDataPickerTabByState('datePickerMonthYear', 'toBeVisible')
      })
    })

    await test.step(`Выбираем ${selectDateTestData.stringMonth} в выпадающем меню "Month".`, async () => {
      await datePicker.selectMonthOrYearInSelectMenu('month', selectDateTestData.stringMonth)
    })

    await test.step('Проверяем корректное отображение месяца в селект меню "Month".', async () => {
      await datePicker.verifyMonthOrYearInSelectMenu('month', `${selectDateTestData.numberMonth - 1}`)
    })

    await test.step(`Выбираем ${selectDateTestData.year} в выпадающем меню "Year".`, async () => {
      await datePicker.selectMonthOrYearInSelectMenu('year', selectDateTestData.year)
    })

    await test.step('Проверяем корректное отображение года в селект меню "Year".', async () => {
      await datePicker.verifyMonthOrYearInSelectMenu('year', `${selectDateTestData.year}`)
    })

    await test.step('Проверяем корректное отображение месяца и года в шапке пагинации.', async () => {
      expect(`${selectDateTestData.stringMonth} ${selectDateTestData.year}`).toBe(await datePicker.monthYearNavigationOutput.textContent())
    })

    await test.step(`Выбираем ${selectDateTestData.day}.`, async () => {
      await datePicker.selectDayByNumber(selectDateTestData.day)
    })

    await test.step('Проверяем что модальное окно закрылось.', async () => {
      await datePicker.verifyDataPickerTabByState('datePickerMonthYear', 'toBeHidden')
    })

    await test.step(`Сравниваем поле виджета "Select Date" c ${selectDateTestData.extendedDate}`, async () => {
      expect(selectDateTestData.extendedDate).toBe(await datePicker.selectDateInput.inputValue())
    })
  })

  test('CASE_6: Проверка даты из поля виджета "Data And Time".', async () => {
    await test.step(`Сравниваем дату виджета "Data And Time" с сегодняшней.`, async () => {
      expect(await datePicker.dateAndTimeInput.getAttribute('value')).toBe(datePicker.getCurrentDateForDateAndTime())
    })
  })

  test('CASE_7: Проверяем функционал выбора месяца и года через выпадающие меню виджета "Date And Time".', async () => {
    await test.step('Pre-condition', async () => {
      await test.step('Нажимаем на виджет "Date And Time".', async () => {
        await datePicker.dateAndTimeInput.click()
      })

      await test.step('Проверяем что модальное окно открылось.', async () => {
        await datePicker.verifyDataPickerTabByState('dateAndTimePicker', 'toBeVisible')
      })
    })

    await test.step(`Выбираем ${dateAndTimeTestData.month} в выпадающем меню "Month".`, async () => {
      await datePicker.selectMonthOrYearInDropdownMenu('month', dateAndTimeTestData.month)
    })

    await test.step('Проверяем корректное отображение месяца в выпадающем меню "Month".', async () => {
      await datePicker.verifyMonthOrYearInDropdownMenu('month', dateAndTimeTestData.month)
    })

    await test.step(`Выбираем ${dateAndTimeTestData.year} в выпадающем меню "Year".`, async () => {
      await datePicker.selectMonthOrYearInDropdownMenu('year', dateAndTimeTestData.year)
    })

    await test.step('Проверяем корректное отображение года в выпадающем меню "Year".', async () => {
      await datePicker.verifyMonthOrYearInDropdownMenu('year', dateAndTimeTestData.year)
    })

    await test.step('Проверяем корректное отображение месяца и года в шапке пагинации.', async () => {
      expect(`${dateAndTimeTestData.month} ${dateAndTimeTestData.year}`).toBe(await datePicker.monthYearNavigationOutput.textContent())
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

    await test.step(`Сохраняем текущую дату в ${currentDate}`, async () => {
      initialDate = await datePicker.dateAndTimeInput.inputValue()
    })

    await test.step('Нажимаем на виджет "Date And Time".', async () => {
      await datePicker.dateAndTimeInput.click()
    })

    await test.step('Проверяем что модальное окно открылось.', async () => {
      await datePicker.verifyDataPickerTabByState('dateAndTimePicker', 'toBeVisible')
    })

    await test.step(`Выбираем ${dateAndTimeTestData.day}.`, async () => {
      await datePicker.selectDayByNumber(dateAndTimeTestData.day)
    })

    await test.step(`Проверка изменения цвета ${dateAndTimeTestData.day}.`, async () => {
      await datePicker.verifyDayStatus(dateAndTimeTestData.day)
    })

    await test.step(`Сравниваем дату в поле виджета с ${currentDate}.`, async () => {
      currentDate = await datePicker.dateAndTimeInput.inputValue()

      await assertByState(currentDate, initialDate, 'notMatch')
    })
  })

  test('CASE_10: Проверка функционала выбора даты виджета "Data And Time".', async () => {
    await test.step('Pre-conditions', async () => {
      await test.step('Нажимаем на виджет "Date And Time".', async () => {
        await datePicker.dateAndTimeInput.click()
      })

      await test.step('Проверяем что модальное окно открылось.', async () => {
        await datePicker.verifyDataPickerTabByState('dateAndTimePicker', 'toBeVisible')
      })
    })

    await test.step(`Выбираем ${dateAndTimeTestData.month} в выпадающем меню "Month".`, async () => {
      await datePicker.selectMonthOrYearInDropdownMenu('month', dateAndTimeTestData.month)
    })

    await test.step('Проверяем корректное отображение месяца в выпадающем меню "Month".', async () => {
      await datePicker.verifyMonthOrYearInDropdownMenu('month', dateAndTimeTestData.month)
    })

    await test.step(`Выбираем ${dateAndTimeTestData.year} в выпадающем меню "Year".`, async () => {
      await datePicker.selectMonthOrYearInDropdownMenu('year', dateAndTimeTestData.year)
    })

    await test.step('Проверяем корректное отображение года в выпадающем меню "Year".', async () => {
      await datePicker.verifyMonthOrYearInDropdownMenu('year', dateAndTimeTestData.year)
    })

    await test.step('Проверяем корректное отображение месяца и года в шапке пагинации.', async () => {
      expect(`${dateAndTimeTestData.month} ${dateAndTimeTestData.year}`).toBe(await datePicker.monthYearNavigationOutput.textContent())
    })

    await test.step(`Выбираем ${dateAndTimeTestData.day}.`, async () => {
      await datePicker.selectDayByNumber(dateAndTimeTestData.day)
    })

    await test.step(`Проверка выбора ${dateAndTimeTestData.day} в календаре.`, async () => {
      await datePicker.verifyDayStatus(dateAndTimeTestData.day)
    })

    await test.step(`Выбираем ${dateAndTimeTestData.time} в списке времени.`, async () => {
      await datePicker.selectTimeByNumber(dateAndTimeTestData.time)
    })

    await test.step('Проверяем что модальное окно закрылось.', async () => {
      await datePicker.verifyDataPickerTabByState('dateAndTimePicker', 'toBeHidden')
    })

    await test.step('Проверяем корректное отображение даты.', async () => {
      expect(await datePicker.dateAndTimeInput.inputValue()).toBe(dateAndTimeTestData.expectedDate)
    })

    await test.step('Нажимаем на виджет "Date And Time".', async () => {
      await datePicker.dateAndTimeInput.click()
    })

    await test.step(`Проверка изменения цвета ${dateAndTimeTestData.time}`, async () => {
      await datePicker.verifyTimeStatus(dateAndTimeTestData.time)
    })
  })

  test('CASE_11: Проверка ручного ввода даты виджета "Date And Time".', async () => {
    await test.step('Pre-conditions', async () => {
      await test.step('Нажимаем на виджет "Date And Time".', async () => {
        await datePicker.dateAndTimeInput.click()
      })

      await test.step('Проверяем что модальное окно открылось.', async () => {
        await datePicker.verifyDataPickerTabByState('dateAndTimePicker', 'toBeVisible')
      })

      await test.step('Очищаем поле ввода.', async () => {
        await datePicker.dateAndTimeInput.fill('')
      })
    })

    await test.step(`Вводим дату из ${dateAndTimeTestData.customDate}`, async () => {
      await datePicker.dateAndTimeInput.fill(dateAndTimeTestData.customDate)
    })

    await test.step('Проверяем правильное отображение в поле ввода.', async () => {
      expect(dateAndTimeTestData.customDate).toBe(await datePicker.dateAndTimeInput.getAttribute('value'))
    })

    await test.step('Проверяем корректное отображение месяца в выпадающем меню "Month".', async () => {
      await datePicker.verifyMonthOrYearInDropdownMenu('month', dateAndTimeTestData.month)
    })

    await test.step('Проверяем корректное отображение года в выпадающем меню "Year".', async () => {
      await datePicker.verifyMonthOrYearInDropdownMenu('year', dateAndTimeTestData.year)
    })

    await test.step('Проверяем корректное отображение месяца и года в шапке пагинации.', async () => {
      expect(`${dateAndTimeTestData.month} ${dateAndTimeTestData.year}`).toBe(await datePicker.monthYearNavigationOutput.textContent())
    })

    await test.step(`Проверяем выделение ${dateAndTimeTestData.day}.`, async () => {
      await datePicker.verifyDayStatus(dateAndTimeTestData.day)
    })

    await test.step(`Проверяем выделение ${dateAndTimeTestData.time}.`, async () => {
      await datePicker.verifyTimeStatus(dateAndTimeTestData.time)
    })

    await test.step('Нажимаем клавишу "Ввод".', async () => {
      await datePicker.clickEnterOnKeyboard('dateAndTimeInput')
    })

    await test.step('Проверяем что модальное окно закрылось.', async () => {
      await datePicker.verifyDataPickerTabByState('dateAndTimePicker', 'toBeHidden')
    })

    await test.step('Проверяем корректное отображение даты.', async () => {
      expect(await datePicker.dateAndTimeInput.inputValue()).toBe(dateAndTimeTestData.expectedDate)
    })
  })

  test('CASE_12: Проверка навигации в выпадающем меню "Год" в "Date And Time".', async () => {
    let year: string = ''

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
      year = `${await datePicker.lastYearInDropdownMenu.textContent()}`
    })

    await test.step('Нажимаем кнопку "Следующий год"', async () => {
      await datePicker.clickNavigationYearDropdownMenuButtonByAction('next')
    })

    await test.step(`Сравниваем последний год из списка с ${year}`, async () => {
      await assertByState(`${await datePicker.lastYearInDropdownMenu.textContent()}`,year,'notMatch')
    })

    await test.step(`Сохраняем последний год из списка в ${year}`, async () => {
      year = `${await datePicker.lastYearInDropdownMenu.textContent()}`
    })

    await test.step('Нажимаем кнопку "Предыдущий год"', async () => {
      await datePicker.clickNavigationYearDropdownMenuButtonByAction('previous')
    })

    await test.step(`Сравниваем последний год из списка с ${year}`, async () => {
      await assertByState(`${await datePicker.lastYearInDropdownMenu.textContent()}`,year,'notMatch')
    })
  })
})