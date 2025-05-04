/*TODO: Retrieve from local storage the neccessary information
to query edjoin jobpostings*/

import puppeteer from 'puppeteer'

const getData = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    })

    const page = await browser.newPage()

    await page.goto("http://quotes.toscrape.com/", {
        waitUntil: "domcontentloaded",
    })
}

// getData()

function ResultPage() {
    return (
        <div>
            Result Page
        </div>
    )
}

export default ResultPage;