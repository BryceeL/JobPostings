import puppeteer from 'puppeteer'
import { WaitTask } from 'puppeteer'

function random(min, max) {
    return Math.random() * (max - min) + min;
}

//delay resolve function by ms
//await for this promise function to complete
//TODO: delay goto each page
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const getJobPostings = async () => {
    const browser = await puppeteer.launch({
        headless: false,
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
    await delay(2000, 5000)

    // const jobPostings = await page.evaluate(() => {

    //     const jobContainerList = document.querySelectorAll(".job-contain")

    //     return Array.from(jobContainerList).map((jobPosting) => {

    //         const jobTitle = jobPosting.querySelector(".card-job-title").innerText
    //         const jobLink = jobPosting.querySelector("a").href
    
    //         return {jobTitle, jobLink}
    //     })
    // })
    // console.log(jobPostings)

    await page.click('xpath=//a[@data-page="2"]')
    await page.waitForNavigation()
    // await delay(2000, 5000)

    await browser.close()
}

getJobPostings()