import { useNavigate } from 'react-router-dom';

import ProfileFeed from '../../components/Feed/ProfileFeed';
import Feed from '../../components/Feed/Feed';
import WebElementInput from '../../components/WebElementInput/WebElementInput';

import "./InputPage.css"

import { useProfileState } from "../../hooks/ProfileState"

function InputPage() {
    const profileState = useProfileState({
       districts : JSON.parse(localStorage.getItem("districts") || '[]'),
       keywords : JSON.parse(localStorage.getItem("keywords") || '[]'),

       institutionTitleContainerName: JSON.parse(localStorage.getItem("institutionTitleContainerName") || ''),
       institutionTitleElementName: JSON.parse(localStorage.getItem("institutionTitleElementName") || ''),
       jobContainerName: JSON.parse(localStorage.getItem("jobContainerName") || ''),
       jobTitleName: JSON.parse(localStorage.getItem("jobTitleName") || ''),
       webDomain: JSON.parse(localStorage.getItem("webDomain") || ''),

       currentProfile: 0,
       profileList: [],
    })

    const navigate = useNavigate();
    return (
        <div className='input-page'>  
            <div className="inputs-container">
                <ProfileFeed
                    keyName={"currentProfile"}
                    placeHolderText={'Input a scrape profile'}
                ></ProfileFeed>
                <Feed
                    feedState={profileState("districts")}
                    placeHolderText={"Input a instituion's name"}
                ></Feed>
                {/* <Feed
                    keyName={"keywords"}
                    placeHolderText={`Input a keyword`}
                ></Feed> */}
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