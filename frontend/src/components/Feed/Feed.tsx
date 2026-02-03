import { useState, useEffect } from 'react';
import FeedItem from "../FeedItem/FeedItem";

import "./Feed.css"

type FeedState<T> = {
    stateValue: T[],
    get: () => T[],
    set: (v: T[]) => void
}

type placeHolderProp = {
    feedState: FeedState<string>
    placeHolderText: string
}


function Feed({feedState, placeHolderText}: placeHolderProp) {
    const { stateValue, get, set } = feedState

    const [list, setList]: any = useState([])
    const [input, setInput]: any = useState("")

    const LScurrentProfile = JSON.parse(localStorage.getItem("currentProfile") || '[]')

    useEffect(() => {
        if (stateValue.length != 0) {
            setList(stateValue)
        }

    }, [stateValue]);

    //update list to local storage and clear input box
    function addToList() {
        if(LScurrentProfile == 0) {
            alert("Create a Scrape Profile before inputting.")       
        } else if(input.trim() == "") {
            alert("Input field cannot be empty.")
        } else if(list.includes(input)) {
            alert("This is a duplicate entry.")
        } else {
            setList([...list, input])
            localStorage.setItem(keyName, JSON.stringify([input, ...list]))
            set([input, ...list])
            setInput("")
        }
        
    }

    //return items from the list except 'deleteItem'
    function deleteFromList(deleteItem: string) {
        const newList: any = list.filter((item: string) => {
            return item != deleteItem
        })
        setList(newList)
        localStorage.setItem(keyName, JSON.stringify(newList))
    }

    return (
        <div className='feed'>
            <div className='button-container'>
                <input
                    type='text'
                    id='group'
                    value={input}
                    disabled={LScurrentProfile == 0 ? true : false}
                    placeholder={placeHolderText}
                    onChange={(e) => setInput(e.target.value)}
                />

                <button 
                    onClick={() => addToList()}>Add</button>
            </div>
            
            <div className="feed-container">
                <div className='scroll'>
                    {list.map((item: any) => (
                        <FeedItem
                            item={item}
                            deleteFunction={deleteFromList}
                        ></FeedItem>
                    ))}
                </div>
                
            </div>
        </div>

    )
}

export default Feed;