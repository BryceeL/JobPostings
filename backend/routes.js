import express from "express"
import puppeteer from "puppeteer"
const router = express.Router()

let isScraping = false

function randomDelay(min, max) {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function scrapeDistrict(district, keywords, webElementList) {
    let pageCount = 1
    let isLastPage = false
    let matchingJobs = []
    let softErrorData = {
        error: false,
        reason: ""
    }
 
    console.log(`Opening browser for '${webElementList.webDomain}/${district}'`)
    const browser = await puppeteer.launch({
        //Parameters for Local Development
        // headless: false, //false = show browser 
        // slowMo: 50,
        
        //Parameters for Live Deployment
        headless: "new",
        //Parameters to keep
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage"
        ]
    })

    try {
        //load page
        const page = await browser.newPage()
        await page.goto(`${webElementList.webDomain}/${district}`, {
            waitUntil: "domcontentloaded",
        })
        do {
            await page.waitForSelector('body');
            console.log(`'${district}' page ${pageCount} loaded`)
            await randomDelay(200, 2000)
            //checks if page has a job container
            const validPage = await page.evaluate((webElementList) => {
                const jobContainer = document.querySelector(webElementList.jobContainerName)
                if (jobContainer == null) {
                    return false
                } else {
                    return true
                }
            }, webElementList)

            if(!validPage) {
                console.log(`'Cannot find element with "Job Container Name" for ${district}'s page ${pageCount}`)
                softErrorData.error = true
                softErrorData.reason = `"${jobContainerName}" not found`
                return {matchingJobs, softErrorData}
            }
            console.log(`'${district}' page ${pageCount} is valid`)

            //Scrape institution's name, job titles, and respective links
            await page.waitForSelector(webElementList.jobContainerName)
            await page.waitForSelector(webElementList.institutionTitleContainerName)
            const jobPostings = await page.evaluate((webElementList) => {
                const jobContainerList = document.querySelectorAll(webElementList.jobContainerName)
                const bioBox = document.querySelector(webElementList.institutionTitleContainerName)

                return Array.from(jobContainerList).map((jobPosting) => {
                    const jobTitle = jobPosting.querySelector(webElementList.jobTitleName).innerText
                    const jobLink = jobPosting.querySelector("a").href
                    const districtTitle = bioBox.querySelector(webElementList.institutionTitleElementName).innerText

                    return {jobTitle, jobLink, districtTitle}
                })
            }, webElementList)

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

            await randomDelay(500, 3000)

            //checks if there is a .pagination
            const hasPagination = await page.evaluate((webElementList) => {
                const pagination = document.querySelector(webElementList.pagination)
                if (pagination == null) {
                    return false
                } else {
                    return true
                }
            }, webElementList)
            
            if (!hasPagination) {
                isLastPage = true
                continue
            }

            await page.waitForSelector(`${webElementList.pagination}`)
            //returns the class list of all the pagination buttons
            const pageClasses = await page.evaluate((webElementList) => {
                const pageList = document.querySelector(webElementList.pagination)
                const pageButtons = pageList.querySelectorAll("li")

                if (pageButtons == null) {
                    return {}
                } else {
                    return Array.from(pageButtons).map((pageButton) => {
                                        const classList = pageButton.classList
                                        return {classList}
                    })
                }
            }, webElementList)

            //determine if last page if there is no navigation button or the '>' button is disabled
            //Navigate to next page if not the last one
            if(pageClasses.length > 0 && pageClasses[pageClasses.length-1].classList[0] != 'disabled') {
                pageCount++
                await Promise.all([
                        page.waitForNavigation(),
                        //find and click anchor element with "data-page" property
                        // page.click(`xpath=//a[@data-page="${pageCount}"]`)
                        page.click(`${webElementList.pagination} > ul > li:last-child > a`)
                ])
            } else {
                isLastPage = true
            }
        } while (isLastPage == false)

        console.log(`Successfully scraped page ${pageCount} of '${district}'`)
        return {matchingJobs, softErrorData}
    } finally {
        await browser.close()
    }  
}

router.post('/scrape_jobs', async (req, res) => {
    const {district, keywordsList = [], webElementList} = req.body

    if (isScraping) {
        console.error(`Cannot scrape ${district}: scraping in progress`)
        return res.status(429).json({ error: "Scrape already in progress" })
    }

    console.log("district:", district)
    console.log("keywords:", keywordsList)
    console.log("web elements:", webElementList)

    isScraping = true
    try {
        const result = await scrapeDistrict(district, keywordsList, webElementList)
        if (result.softErrorData.error == true) {
            res.status(400).json({ error: result.softErrorData.reason })
        } else {
            res.status(200).json(result)
        }
    } catch (error) {
        console.error(`Scraping ${district} failed:\n`+error);
        res.status(500).json({ error: 'Scraping failed' })
    } finally {
        isScraping = false
    }
});

export default router