/*TODO: Retrieve from local storage the neccessary information
to query edjoin jobpostings*/
import { useState, useEffect, useRef } from 'react';

function ResultPage() {
    const [data, setData]: any = useState("");

    const calledRef = useRef(false);
    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;

        console.log('Calling API...');
        fetch(`http://localhost:3001/api/scrape_jobs?keydata=${encodeURIComponent("tee")}`)
          .then(res => res.json())
          .then(data => setData(data))
          .catch(err => console.error('Fetch error:', err));
    }, []);

    console.log(data)
    
    return (
        <div>
            Result Page
            
        </div>
    )
}

export default ResultPage;