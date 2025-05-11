import { useNavigate } from 'react-router-dom';

import Feed from '../../components/Feed/Feed';

import "./InputPage.css"

function InputPage() {
    const navigate = useNavigate();
    return (
        <div className='input-page'>            
            <Feed
                keyName={"districts"}
                placeHolderText={`Input a district's Name`}
            ></Feed>

            <Feed
                keyName={"keywords"}
                placeHolderText={`Input a keyword`}
            ></Feed>
            <button onClick={() => navigate("/results")}>Results</button>
        </div>
    )
}

export default InputPage;