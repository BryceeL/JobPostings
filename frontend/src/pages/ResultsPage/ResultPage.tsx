import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "@/config";

import "./ResultPage.css"

type JobType = {
    jobTitle: string,
    jobLink: string,
    districtTitle: string
}

function ResultPage() {
    const [jobPostings, setJobPostings] = useState<JobType[]>([])

    const [scrapeAmount, setScrapeAmount] = useState<number>(0)

    const [finished, setFinished] = useState<boolean>(false)

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

    function formatTime(number: number) {
        return number < 10 ? '0' + number : number;
    }

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
        if (calledRef.current) return;
        calledRef.current = true;

        if (districtsList.length == 0) {
            alert("Please add some district names.")
        } 
        if (keywordsList.length == 0)   {
            alert("Please add some keywords to match.")
        } 

        setCurrentTime(`${year}-${month+1}-${day}_${hours%12}.${formatTime(minutes)}.${formatTime(seconds)}_${meridiem}`)

        districtsList.forEach((district: string) => {
            fetch(`${API_URL}/api/scrape_jobs?district=${encodeURIComponent(district)}&keywords=${encodeURIComponent(keywordsList.join(','))}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Failed to fetch');
                    }
                    return res.json();
                })
                .then(data => {
                    //Response that it is valid
                    if (data.invalidDistrict == true) {
                        console.log(`Name error for '${district}'`)
                        setFailedScrapes(failedScrapes => [...failedScrapes, `${district} (Invalid Name)`])
                    } else {
                        const jobs = data.matchingJobs
                        setJobPostings(jobPostings => [...jobPostings, ...jobs])
                        setCompletedScrapes(completedScrapes => [...completedScrapes, district])
                    }
                    incrementScrapeAmount()
                } )
                .catch(err => {
                    setFailedScrapes(failedScrapes => [...failedScrapes, `${district} (Scraping Error)`])
                    incrementScrapeAmount()

                    console.error(`Fetch error for '${district}'`, err)
                    console.log("error")
                })
        })


      
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
            <p>Districts scraped: {scrapeAmount}/{districtsList.length}</p>

            <div className='button-container'>
                <button onClick={() => navigate("/")}>Back</button>

                {jobPostings.length > 0 && (
                    <button onClick={downloadJobPostings}>Download Job Postings</button>
                )}
            </div>
            
            <p>{jobPostings.length == 0 && finished ? 'No matching job posts found.': ""}</p>
            
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