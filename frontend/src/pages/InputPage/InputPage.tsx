import { useNavigate } from 'react-router-dom';

import Feed from '../../components/Feed/Feed';
import WebElementInput from '../../components/WebElementInput/WebElementInput';

import "./InputPage.css"

function InputPage() {
    const navigate = useNavigate()

    function importScrapeProfile(file: File) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string
                const data: Record<string, string> = JSON.parse(text)

                Object.entries(data).forEach(([key, value]) => {
                    localStorage.setItem(key, value)
                })

                console.log("LocalStorage restored successfully")
                navigate(0)
            } catch (err) {
                alert("This is an invalid json file. Please provide one that has been exported by this application.")
                console.error("Invalid JSON file", err)
            }
        }
        reader.readAsText(file)
    }

    
    function exportScrapeProfile() {
        const data: Record<string, string> = {}
        const input = window.prompt("Name your exported scrape profile:");
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (!key) continue

            const value = localStorage.getItem(key)
            if (value !== null) {
            data[key] = value
            }
        }

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json"})
        const url = URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = url
        a.download = input+".json"
        a.click()

        URL.revokeObjectURL(url)
    }

    return (
        <div className='input-page'>  
            <div className="inputs-container">
                <Feed
                    keyName={"districts"}
                    placeHolderText={`Input a district's name`}
                ></Feed>
                <Feed
                    keyName={"keywords"}
                    placeHolderText={`Input a keyword`}
                ></Feed>
                <div className='web-inputs-container'>
                    <WebElementInput
                        text={"Web Domain"}
                        placeHolderText={'https://www.edjoin.org'}
                        keyName={"webDomain"}
                    ></WebElementInput>
                    <WebElementInput
                        text={"Job Container Name"}
                        placeHolderText={'.job-contain'}
                        keyName={"jobContainerName"}
                    ></WebElementInput>
                    <WebElementInput
                        text={"Job Title Name"}
                        placeHolderText={'.card-job-title'}
                        keyName={"jobTitleName"}
                    ></WebElementInput>
                    <WebElementInput
                        text={"Institution Title Container Name"}
                        placeHolderText={'.bioBox'}
                        keyName={"institutionTitleContainerName"}
                    ></WebElementInput>
                    <WebElementInput
                        text={"Organization Title Element Name"}
                        placeHolderText={'h1'}
                        keyName={"institutionTitleElementName"}
                    ></WebElementInput>
                </div>
              
            </div> 

            <button className='result-button' onClick={() => navigate("/results")}>Scrape Jobs Posts</button>     
            <div className="jsonfile-container">
                <button 
                    onClick={exportScrapeProfile}
                >Export</button>
                <input
                    type="file"
                    accept=".txt,.json"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) importScrapeProfile(file);
                    }}
                ></input>
            </div>
           
        </div>
    )
}

export default InputPage;