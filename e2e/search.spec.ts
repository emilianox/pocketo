import { test, expect, chromium } from "@playwright/test";
import Items from "@services/__mocks__/get.json";
import Tags from "@services/__mocks__/getTags.json";

test("search", async ({ page }) => {
  // const browser = await chromium.launch({ devtools: true,slowMo: 250 });

  // const page = await browser.newPage();

  // // Subscribe to 'request' and 'response' events.
  // page.on("request", (request) =>
  //   console.log(">>", request.method(), request.url())
  // );
  // page.on("response", (response) =>
  //   console.log("<<", response.status(), response.url())
  // );

  await page.route("**/api/items/getTags**", (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify(Tags),
    })
  );

  await page.route("**/api/items/get**", (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify(Items),
    })
  );

  // Go to http://localhost:9807/
  await page.goto("http://localhost:9807/");

  // Fill [placeholder="Search\ using\ text\ and\ \'\#tag\'"]
  await page.fill(
    "[placeholder=\"Search\\ using\\ text\\ and\\ \\'\\#tag\\'\"]",
    "#saas"
  );
  await page.selectOption('select[name="state"]', "all");
  await page.click("text=Search");

  await expect(page).toHaveURL(
    "http://localhost:9807/?search=%23saas&state=all&domain=&sort=newest"
  );

  await page.selectOption('select[name="state"]', "archive");
  await page.click("text=Search");

  await expect(page).toHaveURL(
    "http://localhost:9807/?search=%23saas&state=archive&domain=&sort=newest"
  );

  await page.selectOption('select[name="state"]', "unread");
  await page.click("text=Search");
  await expect(page).toHaveURL(
    "http://localhost:9807/?search=%23saas&state=unread&domain=&sort=newest"
  );

  // Fill [placeholder="webpage\.domain"]
  await page.fill('[placeholder="webpage\\.domain"]', "twitter.com");
  await page.click("text=Search");
  await expect(page).toHaveURL(
    "http://localhost:9807/?search=%23saas&state=unread&domain=twitter.com&sort=newest"
  );

  // Select oldest
  await page.selectOption('select[name="sort"]', "oldest");
  await page.click("text=Search");
  await expect(page).toHaveURL(
    "http://localhost:9807/?search=%23saas&state=unread&domain=twitter.com&sort=oldest"
  );

  // // Check input[name="favorite"]
  await page.check('input[name="favorite"]');
  await page.click("text=Search");
  await expect(page).toHaveURL(
    "http://localhost:9807/?state=unread&domain=twitter.com&sort=oldest&favorite=1"
  );

  // await page.pause();
});
