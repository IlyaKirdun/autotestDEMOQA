# autotest DEMOQA

## 🚀 Review

"autotest DEMOQA" - This is my pet-project, in which I get acquainted with practices and approaches in auto-tests using TypeScript and the Playwright framework. The project is organized according to the Page Object Model principle, which helps improve testing skills.

## 🛠️ Functions

- Practicing skills with the Playwright framework.
- Writing tests in TypeScript.
- Organizing code using the Page Object Model pattern.
- Integration with ESLint to maintain code quality
- Integration with Qase

## 📦 Install

To install and run my project, make sure you have Node.js and Git installed! Then follow these steps:

1. **Clone the repository:**

```bash
git clone [https://github.com/IlyaKirdun/autotestDEMOQA]
```

2. Installing dependencies:

```bash
npm install
npx playwright install --with-deps
```

3. **Check functionality:**

Run tests to make sure everything works:

```bash
npm run test
```

## 🚀 Use

The following commands are available in this project:

- `npm run tests`: Run all tests using Playwright.
- `npm run qase`: Run all tests and submit the results to qase.
- `npm run lint`: Code inspection using ESLint.
- `npm run lint fix`: Automatically fix errors found by ESLint.

##    Testing

The project uses Playwright to write and run tests. To run the tests, use the `npm run test` command.

Project structure:

```plaintext
.github/
└── workflows/
    └── playwright.yml

node_modules/

page/
├──brokenlinksImages.ts
├──buttons.page.ts
├──checkBox.page.ts
├──dynamicProperties.page.ts
├──links.page.ts
├──main.page.ts
├──radioButton.page.ts
├──textBox.page.ts
├──uploadAndDownload.page.ts
└──webTables.page.ts

test-results/

testFiles/
└──fileForUpload.jpeg

tests/
├──widgets/
    └──datePicker.spec.ts
├──brokenlinksImages.spec.ts
├──buttons.spec.ts
├──checkBox.spec.ts
├──dynamicProperties.spec.ts
├──links.spec.ts
├──radioButton.spec.ts
├──textBox.spec.ts
├──uploadAndDownload.spec.ts
└──webTables.spec.ts

utils/
├──components/
    ├──datePicker.page.ts
|   ├──navigationBar.page.ts
|   └──registrationModalWindow.page.ts
├──downloads/
├──functions.ts
└──types.ts

.env.example
.gitignore
eslint.config.mjs
package.json
package-lock.json
playwright.config.ts
README.md
tsconfig.json
```

Main files and folders:

- **utils/components**: Contains application components.
- **utils/testFiles**: Contains samples for tests.
- **page/main.page.ts**: An example of a page organized according to the Page Object Model.
- **utils/**: Utility functions, such as `functions.ts`.
- **.github/workflows/playwright.yml**: CI configuration to run tests automatically.
