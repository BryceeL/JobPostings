import puppeteer from 'puppeteer'

function randomDelay(min, max) {
    let ms = Math.random() * (max - min) + min;
    return new Promise(resolve => setTimeout(resolve, ms))
}

const getJobPostings = async () => {
    const browser = await puppeteer.launch({
        headless: false, //false = show browser 
        defaultViewport: null, 
        // slowMo: 250, //slow puppeteer ops by 250ms (prefer for debuging)
    })

    //load page
    const page = await browser.newPage()
    await page.goto("https://www.edjoin.org/cvusdk12?rows=10&page=1", {
        waitUntil: "domcontentloaded",
    })

    //wait for target container to load and then 2 secs after
    await page.waitForSelector('.job-contain');
    await randomDelay(2000, 4000)

    // const jobPostings = await page.evaluate(() => {

    //     const jobContainerList = document.querySelectorAll(".job-contain")

    //     return Array.from(jobContainerList).map((jobPosting) => {

    //         const jobTitle = jobPosting.querySelector(".card-job-title").innerText
    //         const jobLink = jobPosting.querySelector("a").href
    
    //         return {jobTitle, jobLink}
    //     })
    // })
    // console.log(jobPostings)

    await Promise.all([
        page.waitForNavigation(),
        page.click('xpath=//a[@data-page="2"]')
    ])

    await page.waitForSelector('.pagination');
    const isLastPage = await page.evaluate(() => {

        const pageList = document.querySelector(".pagination")

        const pageAnchor = pageList.querySelector(".disabled") ? true : false
    
        return pageAnchor
    })
    console.log(isLastPage)

    await randomDelay(2000, 4000)

    await browser.close()

    res.status(200).json({ isLastPage });
    
}

getJobPostings()
