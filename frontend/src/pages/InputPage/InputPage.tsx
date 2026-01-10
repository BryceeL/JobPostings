import { useNavigate } from 'react-router-dom';

import Feed from '../../components/Feed/Feed';
import WebElementInput from '../../components/WebElementInput/WebElementInput';

import "./InputPage.css"

function InputPage() {
    const navigate = useNavigate();
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
                        text={"Job Container Name"}
                        placeHolderText={'.job-contain'}
                        keyName={"Job Container Name"}
                    ></WebElementInput>
                    <WebElementInput
                        text={"Job Title Name"}
                        placeHolderText={'.card-job-title'}
                        keyName={"Job Title Name"}
                    ></WebElementInput>
                    <WebElementInput
                        text={"Organization Title Container Name"}
                        placeHolderText={'.bioBox'}
                        keyName={"Organization Title Container Name"}
                    ></WebElementInput>
                    <WebElementInput
                        text={"Organization Title Element Name"}
                        placeHolderText={'h1'}
                        keyName={"Organization Title Element Name"}
                    ></WebElementInput>
                </div>
              
            </div> 
            <div>
                <button className='result-button' onClick={() => navigate("/results")}>Scrape Jobs Posts</button>
            </div>     
           
        </div>
    )
}

export default InputPage;