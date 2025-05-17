/*TODO: Retrieve from local storage the neccessary information
to query edjoin jobpostings*/
import { useState, useEffect, useRef } from 'react';

function ResultPage() {
    const [data, setData]: any = useState("")
    const [scraped, setScraped]: any = useState(0)

    const districtsList = JSON.parse(localStorage.getItem("districts") || '""')
    const keywordsList = JSON.parse(localStorage.getItem("keywords") || '""')

    const calledRef = useRef(false);
    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;

        console.log(keywordsList)

        districtsList.forEach((district: string) => {
            console.log(`Calling Scraping API for:${district}`)
            fetch(`http://localhost:3001/api/scrape_jobs?district=${encodeURIComponent(district)}&keywords=${encodeURIComponent(keywordsList.join(','))}`)
                .then(res => res.json())
                .then(data => {
                    setData(data)
                    console.log(data)
                    
                    setScraped(scraped + 1)
                } )
                .catch(err => console.error('Fetch error:', err))
            
        });
    }, []);

    
    
    return (
        <div>
            Result Page
            {scraped}
        </div>
    )
}

export default ResultPage;