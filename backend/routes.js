const puppeteer = require('puppeteer')
const express = require('express')
const router = express.Router()

function randomDelay(min, max) {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, ms))
}

router.get('/scrape_jobs', async (request, response) => {
    const KeyData  = request.query.keydata
    console.log('Received', KeyData)

    // try {
    //     console.log("scraping job posts...")
    //     const browser = await puppeteer.launch({
    //         headless: true, //false = show browser 
    //         defaultViewport: null, 
    //     })

    //     //load page
    //     const page = await browser.newPage()
    //     await page.goto("https://www.edjoin.org/cvusdk12?rows=10&page=1", {
    //         waitUntil: "domcontentloaded",
    //     })

    //     //wait for target container to load and then 2 secs after
    //     await page.waitForSelector('.job-contain');
    //     await randomDelay(2000, 5000)

    //     const jobPostings = await page.evaluate(() => {
    //         const jobContainerList = document.querySelectorAll(".job-contain")

    //         return Array.from(jobContainerList).map((jobPosting) => {
    //             const jobTitle = jobPosting.querySelector(".card-job-title").innerText
    //             const jobLink = jobPosting.querySelector("a").href

    //             return {jobTitle, jobLink}
    //         })
    //     })
    //     // console.log(jobPostings)

    //     await browser.close();
    //     response.status(200).json({ jobPostings });
    //     console.log("Successfully scraped posts!")
        
    // } catch (error) {
    //     console.error(error);
    //     response.status(500).json({ error: 'Scraping failed' });
    // }
});

module.exports = router;