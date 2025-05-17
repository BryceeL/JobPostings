import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

type JobTypes = {
    jobTitle: string,
    jobLink: string
}

function ResultPage() {
    const [jobPostings, setJobPostings] = useState<JobTypes[]>([])
    const [scrapeAmount, setScrapeAmount] = useState(0)
    const [scrapeTarget, setScrapeTarget] = useState("")

    const [finished, setFinished]: any = useState(false)

    const districtsList = JSON.parse(localStorage.getItem("districts") || '""')
    const keywordsList = JSON.parse(localStorage.getItem("keywords") || '""')

    const navigate = useNavigate();
    const calledRef = useRef(false);

    const textContent = "a test"
    const blob = new Blob([textContent], {type: 'text/plain'})
    const url = URL.createObjectURL(blob)
    
    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;

        districtsList.forEach((district: string, i: number) => {
            setScrapeTarget(district)
            fetch(`http://localhost:3001/api/scrape_jobs?district=${encodeURIComponent(district)}&keywords=${encodeURIComponent(keywordsList.join(','))}`)
                .then(res => {
                     if (!res.ok) throw new Error('Failed to fetch');
                    return res.json();
                })
                .then(data => {
                    setJobPostings(data.matchingJobs)
                    setScrapeAmount(scrapeAmount + 1)

                    //Finished iterating
                    if (i+1 == districtsList.length) {
                        setScrapeTarget("")
                        setFinished(true)
                    }
                } )
                .catch(err => console.error('Fetch error:', err))
        })

      
    }, [])

    return (
        <div>
            <p>Districts scraped: {scrapeAmount}/{districtsList.length}</p>
            <button onClick={() => navigate("/")}>Back</button>

            <p>{scrapeTarget ? `Scraping: '${scrapeTarget}'`: ""}</p>
            {finished && (
                jobPostings.length > 0 ? (jobPostings.map((jobPosting : JobTypes) => (
                    <div>
                        <a href={jobPosting.jobLink}>{jobPosting.jobTitle}</a>
                        {/* <button onClick={() => { window.location.href = jobPosting.jobLink}}>{jobPosting.jobTitle}</button> */}
                    </div>
                ))) : "No matching job posts found"
            )}

            {finished && (
                 <a href={url} download="jobPostings.txt">Download Job Postings</a>
            )}
        </div>
    )
}

export default ResultPage;