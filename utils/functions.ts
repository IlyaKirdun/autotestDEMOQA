import {Page, expect, Locator} from '@playwright/test'
import fs from "fs";

export async function removeAds(page: Page): Promise<void> {
  const extendAds:string[] = [
    '//div[@id="fixedban"]',
    '//div[@id="Ad.Plus-970x250-1"]',
    '//div[@id="Ad.Plus-970x250-2"]',
    '//div[@class="sidebar-content pattern-background shadow widget-divider-off"]',
    '//section[@id="RightSide_Advertisement"]'
  ]

  await page.waitForLoadState('domcontentloaded')
  await new Promise(resolve => setTimeout(resolve, 1000))

  for (const ads of extendAds) {
    const loc: Locator = page.locator(ads)

    if(await loc.isVisible()){
      await loc.evaluate((elem: SVGAElement | HTMLBRElement): void => elem.remove())
    }
  }
}

export async function assertByState(
    actual: string | number,
    expected: string | number,
    state: 'match' | 'notMatch' = 'match'
): Promise<void> {
  // выбираем нужный expect: либо обычный, либо с .not
  const assertion = state === 'match' ? expect(actual) : expect(actual).not;
  // вызываем toBe на выбранном assertion
  assertion.toBe(expected);
}

export function getParentNameByChildName<T> (obj: {[key: string]: T[]}, value: T): string | undefined {
  for(const key in obj){
    if(obj[key].includes(value)){
      return key
    }
  }
  console.error(`Not found: ${value}`)
  return undefined
}

export function deleteFile (fileName: string, dir: string | undefined = process.env.DOWNLOAD_FOLDER): void {
  const filePath: string = dir + fileName

  try {
    fs.unlinkSync(filePath)
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (err.code === 'ENOENT') {
      console.log(`Файл ${filePath} не найден.`)
    } else {
      throw Error
    }
  }
}

export function verifyFileExist(fileName: string, dir: string | undefined = process.env.DOWNLOAD_FOLDER) {
  const path: string = dir + fileName

  if (process.env.GITHUB_ACTIONS) {
    expect(fs.existsSync(`downloads/${fileName}`)).toBe(true)
  } else {
    expect(fs.existsSync(path)).toBe(true)
  }
}