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

    let pageCount = 1
    let isLastPage = false
    let invalidDistrict = false
    let matchingJobs = []

    try {
        console.log(`Scraping '${district}'`)
        const browser = await puppeteer.launch({
            headless: true, //false = show browser 
            defaultViewport: null, 
        })

        //load page
        const page = await browser.newPage()
        await page.goto(`https://www.edjoin.org/${district}?rows=10&page=1`, {
            waitUntil: "domcontentloaded",
        })
        console.log(`${district} page loaded`)
        do {
            await randomDelay(2000, 4000)
            await page.waitForSelector('body');
            //checks if page does not have application error
            const validPage = await page.evaluate(() => {
                const headingText = document.querySelector("h1").innerText
                if (headingText.indexOf("Server Error") !== -1) {
                    return false
                } else {
                    return true
                }
            })

            if(!validPage) {
                console.log(`'${district}' is not valid; stop scraping`)
                invalidDistrict = true
                break
            }
             console.log(`${district} is valid page`)

            await page.waitForSelector('.pagination');
            await randomDelay(1000, 5000)
            //returns the class list of all the page buttons
            const pageClasses = await page.evaluate(() => {
                const pageList = document.querySelector(".pagination")
                const pageButtons = pageList.querySelectorAll("li")

                return Array.from(pageButtons).map((pageButton) => {
                    const classList = pageButton.classList
                    return {classList}
                })
            })

            //determine if is last page based on if '>' button is disabled
            if (pageClasses.length > 0 && pageClasses[pageClasses.length-1].classList[0] == 'disabled') {
                isLastPage = true
            } else {
                isLastPage = false
            }

            //Scrape job titles and respective links
            await page.waitForSelector('.job-contain')
            await page.waitForSelector('.bioBox')
            const jobPostings = await page.evaluate(() => {
                const jobContainerList = document.querySelectorAll(".job-contain")
                const bioBox = document.querySelector(".bioBox")

                return Array.from(jobContainerList).map((jobPosting) => {
                    const jobTitle = jobPosting.querySelector(".card-job-title").innerText
                    const jobLink = jobPosting.querySelector("a").href
            
                     const districtTitle = bioBox.querySelector("h1").innerText

                    return {jobTitle, jobLink, districtTitle}
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
            console.log(`Scraped page ${pageCount} of '${district}'`)

            await randomDelay(1000, 5000)

            //Navigate to next page if not the last one
            if(isLastPage == false) {
                pageCount++
                await Promise.all([
                            page.waitForNavigation(),
                            page.click(`xpath=//a[@data-page="${pageCount}"]`)
                ])
            }
        } while (isLastPage == false)

        await browser.close()
        response.status(200).json({ matchingJobs, invalidDistrict })

        if (!invalidDistrict) {
            console.log(`Successfully scraped '${district}'`)
        }
        
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Scraping failed' })
    }
});

module.exports = router;