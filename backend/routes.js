const puppeteer = require('puppeteer')
const express = require('express')
const router = express.Router()

function randomDelay(min, max) {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, ms))
}

router.get('/scrape_jobs', async (request, response) => {
    const district  = request.query.district
    const rawKeywords = request.query.keywords
    const keywords = rawKeywords ? rawKeywords.split(',') : []

    var pageCount = 1
    var isLastPage = false
    var matchingJobs = []

    try {
        console.log(`Scraping from '${district}'`)
        const browser = await puppeteer.launch({
            headless: true, //false = show browser 
            defaultViewport: null, 
        })

        //load page
        const page = await browser.newPage()
        await page.goto(`https://www.edjoin.org/${district}?rows=10&page=1`, {
            waitUntil: "domcontentloaded",
        })
        do {
            await page.waitForSelector('.pagination');
            await randomDelay(3000, 6000)
            //returns the class list of all the page buttons
            const pageClasses = await page.evaluate(() => {
                const pageList = document.querySelector(".pagination")
                const pageButtons = pageList.querySelectorAll("li")

                return Array.from(pageButtons).map((pageButton) => {
                    const text = pageButton.querySelector("a").innerText
                    const classList = pageButton.classList
                    if (text == '>') {
                        return {classList}
                    }
                })
            })

            //determine if is last page based on if '>' button is disabled
            if (pageClasses.length > 0 && pageClasses[pageClasses.length-1].classList[0] == 'disabled') {
                isLastPage = true
            } else {
                isLastPage = false
            }

            //Scrape job titles and respective links
            await page.waitForSelector('.job-contain');
            const jobPostings = await page.evaluate(() => {
                const jobContainerList = document.querySelectorAll(".job-contain")

                return Array.from(jobContainerList).map((jobPosting) => {
                    const jobTitle = jobPosting.querySelector(".card-job-title").innerText
                    const jobLink = jobPosting.querySelector("a").href
            
                    return {jobTitle, jobLink}
                })
            })

            //Iterate job postings and push entries with titles that match a keyword
            jobPostings.forEach((jobPosting) => {
                keywords.forEach((caseKeyword) => {
                    const jobTitle = jobPosting.jobTitle.toLowerCase()
                    const keyword = caseKeyword.toLowerCase()
                    if (jobTitle.indexOf(keyword) !== -1 && !matchingJobs.includes(jobPosting)) {
                        matchingJobs.push(jobPosting)
                    }
                })
            })
            console.log(`Scraped page ${pageCount}`)

            await randomDelay(2000, 4000)

            //Navigate to next page if not the last one
            if(isLastPage == false) {
                pageCount++
                await Promise.all([
                            page.waitForNavigation(),
                            page.click(`xpath=//a[@data-page="${pageCount}"]`)
                ])
            }
        } while (isLastPage == false)

        await browser.close();
        response.status(200).json({ matchingJobs });
        console.log(`Successfully scraped from '${district}'`)
        
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Scraping failed' });
    }
});

module.exports = router;