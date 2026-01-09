import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"

import "./ResultPage.css"

type JobType = {
    jobTitle: string,
    jobLink: string,
    districtTitle: string
}

function ResultPage() {
    const [jobPostings, setJobPostings] = useState<JobType[]>([])

    const [finished, setFinished] = useState<boolean>(false)

    //for visual statistic elements
    const[scrapeTarget, setScrapeTarget] = useState<string>("")
    const [scrapeAmount, setScrapeAmount] = useState<number>(0)
    const [failedScrapes, setFailedScrapes] = useState<string[]>([])
    const [completedScrapes, setCompletedScrapes] = useState<string[]>([])

    const [currentTime, setCurrentTime] = useState<String>("")

    let scrapeCount = 0

    let now = new Date()
    let hours = now.getHours()
    let minutes = now.getMinutes()
    let seconds = now.getSeconds()
    
    let day = now.getDate()
    let month = now.getMonth()
    let year = now.getFullYear()
    let meridiem = "AM"
    if (hours >= 12) {
        meridiem = "PM"
    }

    const [blobJobs, setBlobJobs] = useState<string>("")

    const districtsList = JSON.parse(localStorage.getItem("districts") || '""')
    const keywordsList = JSON.parse(localStorage.getItem("keywords") || '""')

    const navigate = useNavigate();
    const calledRef = useRef(false);

    //Adds '0' before the hour (eg 05:00)
    function formatTime(number: number) {
        return number < 10 ? '0' + number : number;
    }

    //Create and download a blob with a formated string of matched jobs
    function downloadJobPostings() {
        const blob = new Blob([blobJobs], {type: 'text/plain'})
        const url = URL.createObjectURL(blob)

        const a = document.createElement("a");
        a.href = url;
        a.download = `Jobs ${currentTime}.txt`;
        a.click();

        URL.revokeObjectURL(url);
    }

    function incrementScrapeAmount() {
        setScrapeAmount(scrapeAmount => scrapeAmount + 1)
        scrapeCount += 1
        //Finished iterating district lists
        if (scrapeCount == districtsList.length) {
            console.log("finished")
            setFinished(true)
        }
    }

    
    useEffect(() => {
        const runQueue = async () => {
            if (calledRef.current) return
            calledRef.current = true

            if (districtsList.length == 0) {
                alert("Please add some district names.")
            } 
            if (keywordsList.length == 0)   {
                alert("Please add some keywords to match.")
            } 

            setCurrentTime(`${year}-${month+1}-${day}_${hours%12}.${formatTime(minutes)}.${formatTime(seconds)}_${meridiem}`)

            //iterate district list
            for (const district of districtsList) {
                setScrapeTarget(district)
                try {
                    console.log(`Start scraping from district ${district}`)
                    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/scrape_jobs`, {
                            district,
                            keywordsList,
                    })
                     const jobs = res.data.matchingJobs
                    setJobPostings(jobPostings => [...jobPostings, ...jobs])
                    setCompletedScrapes(completedScrapes => [...completedScrapes, district])
                
                } catch (error: any) {
                    let errorMessage
                    if (error.response) {
                        errorMessage = error.response.data.error
                    } else {
                        errorMessage = "Scraping Error"
                    }
                    console.error(`Failed to scrape '${district}'`, errorMessage)
                    setFailedScrapes(failedScrapes => [...failedScrapes, `${district} (${errorMessage})`])
                    
                } finally {
                    setScrapeTarget("")
                    incrementScrapeAmount()
                }
                
            }
        }
        runQueue()
    }, [])

    //sets the text blob for the text file download
    useEffect(() => {
        setBlobJobs("")
        jobPostings.forEach((jobPosting: JobType) => {
            setBlobJobs(blobJobs => `${blobJobs}*${jobPosting.jobTitle}(${jobPosting.districtTitle}):\n${jobPosting.jobLink}\n\n`)
        })
    }, [jobPostings])

    return (
        <div className='result-page'>
            <div>
                Status:
                { 
                    scrapeTarget != "" ? 
                    ` Scraping "${scrapeTarget}"`: " Not Scraping."
                }
            </div>
            <p>
                Districts scraped: {scrapeAmount}/{districtsList.length}
            </p>
            <div className='button-container'>
                <button onClick={() => navigate("/")}>Back</button>

                {jobPostings.length > 0 && (
                    <button onClick={downloadJobPostings}>Download Job Postings</button>
                )}
            </div>
            
            <p>
                {jobPostings.length == 0 && finished ? 
                'No matching job posts found.': ""}
            </p>
            
            <div className='scraped-jobs'>
                { jobPostings.length > 0 ? (jobPostings.map((jobPosting : JobType) => (
                         <a href={jobPosting.jobLink}>{`${jobPosting.jobTitle} (${jobPosting.districtTitle})`}</a>
                    ))) : ""}
            </div>
            
            <div className='notifs failed'>
                {failedScrapes.length > 0 && (
                    (failedScrapes.map((failedDistrict: string) => (
                        <div>Failed: {failedDistrict}</div>
                    )))
                )}
            </div>

            <div className='notifs completed'>
                {completedScrapes.length > 0 && (
                    (completedScrapes.map((completedScrape: string) => (
                        <div>Completed: {completedScrape}</div>
                    )))
                )}
            </div>
            
        </div>
    )
}

export default ResultPage;