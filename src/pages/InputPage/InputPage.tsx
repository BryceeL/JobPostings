import { useNavigate } from 'react-router-dom';

import Feed from '../../components/Feed/Feed';

import "./InputPage.css"

function InputPage() {
    const navigate = useNavigate();
    return (
        <div className='input-page'>  
            <div className="feeds">
                <Feed
                    keyName={"districts"}
                    placeHolderText={`Input a district's name`}
                ></Feed>
                <Feed
                    keyName={"keywords"}
                    placeHolderText={`Input a keyword`}
                ></Feed>
            </div> 
            <div>
                <button className='result-button' onClick={() => navigate("/results")}>Scrape Jobs Posts</button>
            </div>         
           
        </div>
    )
}

export default InputPage;