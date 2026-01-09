import express from "express"
import puppeteer from "puppeteer"
const router = express.Router()

let isScraping = false

function randomDelay(min, max) {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function scrapeDistrict(district, keywords) {
    let pageCount = 1
    let isLastPage = false
    let invalidDistrict = false
    let matchingJobs = []

    console.log('Openning Browser')
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
        await page.goto(`https://www.edjoin.org/${district}?rows=10&page=1`, {
            waitUntil: "domcontentloaded",
        })
        console.log(`'${district}' page ${pageCount} loaded`)
        do {
            await randomDelay(500, 3000)
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
                console.log(`'${district}' page ${pageCount} returned server error; stop scraping`)
                invalidDistrict = true
                break
            }
            console.log(`'${district}' page ${pageCount} is valid`)

            await page.waitForSelector('.pagination');
            //returns the class list of all the page buttons
            const pageClasses = await page.evaluate(() => {
                const pageList = document.querySelector(".pagination")
                const pageButtons = pageList.querySelectorAll("li")

                return Array.from(pageButtons).map((pageButton) => {
                    const classList = pageButton.classList
                    return {classList}
                })
            })

            //determine if last page if there is no navigation button or the '>' button is disabled
            if (pageClasses.length == 0 || pageClasses[pageClasses.length-1].classList[0] == 'disabled') {
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

            await randomDelay(500, 3000)

            //Navigate to next page if not the last one
            if(isLastPage == false) {
                pageCount++
                await Promise.all([
                        page.waitForNavigation(),
                        page.click(`xpath=//a[@data-page="${pageCount}"]`)
                ])
            }
        } while (isLastPage == false)

        if (!invalidDistrict) {
            console.log(`Successfully scraped page ${pageCount} of '${district}'`)
        }
        return {matchingJobs, invalidDistrict}
    } finally {
        await browser.close()
    }  
}

router.post('/scrape_jobs', async (req, res) => {
    const {district, keywordsList = []} = req.body

    if (isScraping) {
        console.error(`Cannot scrape ${district}: scraping in progress`)
        return res.status(429).json({ error: "Scrape already in progress" })
    }

    console.log("district:", district);
    console.log("keywords:", keywordsList);

    isScraping = true
    try {
        const result = await scrapeDistrict(district, keywordsList)
        if (result.invalidDistrict == true) {
            res.status(400).json({ error: 'Invalid District Name' })
        } else {
            res.status(200).json(result)
        }

        
    } catch (error) {
        console.error(`Scraping ${district} failed`)
        console.error(error);
        res.status(500).json({ error: 'Scraping failed' })
    } finally {
        isScraping = false
    }
});

export default router