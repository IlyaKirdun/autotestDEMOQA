import {expect, Locator, Page} from "@playwright/test"
import {MonthList, VisibilityState} from "../types";

export default class DatePicker {
  page: Page
  selectDateInput: Locator
  dateAndTimeInput: Locator
  monthYearNavigationOutput: Locator
  lastYearInDropdownMenu: Locator

  colorMap: { [key: string] : string } = {
    blue: 'rgb(33, 107, 165)',
  }

  constructor(page: Page) {
    this.page = page
    this.selectDateInput = this.page.locator('//input[@id="datePickerMonthYearInput"]')
    this.dateAndTimeInput = this.page.locator('//input[@id="dateAndTimePickerInput"]')
    this.monthYearNavigationOutput = this.page.locator('//div[contains(@class, "header")]/div[contains(@class, "current-month")]')
    this.lastYearInDropdownMenu = this.page.locator('//div[contains(@class, "year-dropdown")]//div[contains(@class, "year-option")][12]')
  }

  getCurrentDateForSelectDate() {
    return new Date().toLocaleDateString("en-US", { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  getCurrentDateForDateAndTime(){
    const formatedDate: string = new Date().toLocaleString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
    const formatedTime: string = new Date().toLocaleTimeString("en-US", {hour12: true, hour: "numeric", minute: "2-digit"})

    return `${formatedDate} ${formatedTime}`
  }

  async getCurrentMonthOrYearInDropdownMenu(menuName: 'month' | 'year') {
      return await this.page.locator(`//span[contains(@class, "selected-${menuName}")]`).innerText()
  }

  async getCurrentMonthOrYearInSelectMenu(menuName: 'month' | 'year') {
    return await this.page.locator(`//select[contains(@class,"${menuName}")]`).inputValue()
  }

  async verifyMonthOrYearInSelectMenu(menuName: 'month' | 'year', valueMonthOrYear: string){
    await expect(this.page.locator(`//select[contains(@class,"${menuName}")]`)).toHaveValue(valueMonthOrYear)
  }

  async verifyMonthOrYearInDropdownMenu(menuName: 'month' | 'year', value: string | number){
    expect(await this.page.locator(`//span[contains(@class, "selected-${menuName}")]`).innerText()).toBe(`${value}`)
  }

  async verifyDataPickerTabByState(name: 'dateAndTimePicker' | 'datePickerMonthYear', state: VisibilityState): Promise<void> {
    const tab: Locator = this.page.locator(`//div[@id="${name}"]//div[@class="react-datepicker-popper"]`)

    await expect(tab)[state]()
  }

  async verifyDayStatus(dayNumber: number, color: string = this.colorMap.blue): Promise<void> {
    const day: Locator = this.page.locator(`//div[contains(@class, "day--selected")][text()="${dayNumber}"]`)
    const currentColor: string = await day.evaluate(el => getComputedStyle(el).backgroundColor)

    expect(currentColor).toBe(color)
  }

  async verifyTimeStatus(time: string, color: string = this.colorMap.blue): Promise<void> {
    const element: Locator = this.page.locator(`//li[contains(text(),"${time}")]`)
    const currentColor: string = await element.evaluate(el => getComputedStyle(el).backgroundColor)

    expect(currentColor).toBe(color)
  }

  async clickMonthOrYearDropdownMenu(menuName: 'month' | 'year') {
    return await this.page.locator(`//span[contains(@class, "selected-${menuName}")]`).click()
  }

  async clickNavigationMonthButtonByAction(action: 'Previous' | 'Next'): Promise<void> {
    await this.page.locator(`//button[text()="${action} Month"]`).click()
  }

  async clickNavigationYearDropdownMenuButtonByAction(action: 'next' | 'previous'): Promise<void> {
    const nextOrPrevious: 'first' | 'last' = action == "next" ? 'first' : 'last'

    await this.page.locator(`//div[contains(@class, "year-dropdown")]//div[contains(@class, "year-option")]`)[nextOrPrevious]().click()
  }

  async clickEnterOnKeyboard(locatorName: 'selectDateInput' | 'dateAndTimeInput'): Promise<void> {
    await this[locatorName].press('Enter')
  }

  async selectDayByNumber(day: number): Promise<void> {
    const firstOrLast: 'first' | 'last' = day <= 15 ? 'first' : 'last'
    const element: Locator = this.page.locator(`(//div[@class="react-datepicker__month"]//div[text()="${day}"])`)[firstOrLast]()

    await element.dispatchEvent('click')
  }

  async selectTimeByNumber(time: string): Promise<void> {
    await this.page.locator(`//li[contains(text(),"${time}")]`).click()
  }

  async selectMonthOrYearInSelectMenu(menuName: 'month' | 'year', value: MonthList | number): Promise<void> {
    await this.page.locator(`//div[@id="datePickerMonthYear"]//select[contains(@class, "${menuName}")]`).selectOption(`${value}`)
  }

  async selectMonthOrYearInDropdownMenu(menuName: 'month' | 'year', value: MonthList | number): Promise<void> {
    await this.page.locator(`//div[contains(@class,"${menuName}-dropdown-container")]/div[contains(@class,"${menuName}-read-view")]`).click()
    await this.page.locator(`//div[contains(@class,"${menuName}-dropdown-container")]//div[text()="${value}"]`).click()
  }
}