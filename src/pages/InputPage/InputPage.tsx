import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function InputPage() {
    //local storage states
    const [distrctList, setDistrictList]: any = useState([])
    const [keywordsList, setKeyWordsList] : any = useState([])

    //input states
    const [groupInput, setGroupInput] : any = useState("")
    const [keywordInput, setKeywordInput] : any = useState("")

    function getGroupInput() {
        console.log(groupInput);
    }

    return (
       
        <div>
            Input Page
            <div className='group-feed'>

            </div>
            <input
                type="text"
                id="group"
                value={groupInput}
                placeholder="Input Group Name"
                className=''
                onChange={(e) => setGroupInput(e.target.value)}
            />
            <button onClick={() => getGroupInput()}>See input</button>
        </div>
    )
}

export default InputPage;