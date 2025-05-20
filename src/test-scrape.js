//Has to be in src to run with node
import puppeteer from 'puppeteer'

function randomDelay(min, max) {
    let ms = Math.random() * (max - min) + min;
    return new Promise(resolve => setTimeout(resolve, ms))
}

const getJobPostings = async () => {
    var pageCount = 1
    var isLastPage = false
    var matchingJobs = []

    //TODO: Handle nonexisting district
    //Assumed to be passed with GET request
    const district = "cvusdk12"
    const keywords = ["substitute", "Intern"]

    const browser = await puppeteer.launch({
        headless: false, //false = show browser 
        defaultViewport: null, 
        // slowMo: 250, //slow puppeteer ops by 250ms (prefer for debuging)
    })

    //load page
    const page = await browser.newPage()
    await page.goto(`https://www.edjoin.org/${district}?rows=10&page=1`, {
        waitUntil: "domcontentloaded",
    })

    do {
        
        await page.waitForSelector('body');
        await randomDelay(1000, 1000)
        //checks if page does not have application error
        const validPage = await page.evaluate(() => {
            const headingText = document.querySelector("h1").innerText
            if (headingText.indexOf("Server Error") !== -1) {
                return false
            } else {
                return true
            }
        })

        console.log(`Is valid page: ${validPage}`)

        if(!validPage) {
            console.log("Not valid page; stop scraping")
            break
        }

        await page.waitForSelector('.pagination');
        await randomDelay(3000, 6000)
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
        console.log(`Is last page: ${isLastPage}`)

        //Scrape job titles and respective links
        await page.waitForSelector('.job-contain');
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
                    // console.log(jobTitle)
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
    await browser.close()

    console.log(matchingJobs)
}

getJobPostings()
