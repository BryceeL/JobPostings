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
            <div>
                <button className='result-button' onClick={() => navigate("/results")}>Scrape Jobs Posts</button>
            </div>     
           
        </div>
    )
}

export default InputPage;