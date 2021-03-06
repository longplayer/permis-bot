const puppeteer = require('puppeteer');
require('dotenv').config();

const url = process.env.APP_URL;

(async () => {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const navigationPromise = page.waitForNavigation();
    const fillTheForm = async (page, validate = true) => {
      // form's fields
      await page.type('input[name="Customer.FirstName"]', process.env.USER_FIRST_NAME);
      await page.type('input[name="Customer.LastName"]', process.env.USER_LAST_NAME);
      await page.type('input[name="Customer.Phone"]', process.env.USER_PHONE);
      await page.type('input[name="Customer.Email"]', process.env.USER_EMAIL);
      await page.type('input[name="Customer.ConfirmEmail"]', process.env.USER_EMAIL);
      await page.type('input[name="Customer.Street"]', process.env.USER_STREET);
      await page.type('input[name="Customer.StreetNumber"]', process.env.USER_STREET_NUMBER);
      await page.type('input[name="Customer.PostalCode"]', process.env.USER_ZIPCODE);
      await page.type('input[name="Customer.City"]', process.env.USER_CITY);
      // form's checkbox check
      await page.click('input#defaultCheck1');
      // submit form click: Confirm appointement
      if(validate) await page.click('input[type="submit"]');
    }

    await page.setViewport({
        width: 1200,
        height: 900,
    });

    // 1. open modal window
    await page.click(".container .col > button");

    // enter validity date
    await page.waitForSelector('input[name="ExpirationDate"]', { visible: true });
    await page.type('input[name="ExpirationDate"]', process.env.EXP_DATE);

    // checkbox click
    await page.click('input#defaultCheck1');

    // // confirm button
    await page.click('input#btnConfirmID');

    // // select Test day and hour
    await page.waitForSelector('form:nth-child(3) input[type="submit"]', { visible: true });

    // // Let user choose the day manually
    navigationPromise;

    // fill the form
    await page.waitForSelector('input[name="Customer.FirstName"]', { visible: true });
    fillTheForm(page, false)

    // check for security alert
    await page.waitForSelector('.alert.alert-danger', { visible: true });

    // // checkbox click
    await page.click('input#defaultCheck1');

    // // checkbox click
    await page.click('input[type="submit"]');

    await page.screenshot({
      path: "confirmation.png"
    });
})();

