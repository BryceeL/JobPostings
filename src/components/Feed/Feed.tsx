import { useState, useEffect } from 'react';
import FeedItem from "../Item/FeedItem";

import "./Feed.css"

type feedTypes = {
    keyName: string,
    placeHolderText: string
}

function Feed(props: feedTypes) {
    const { keyName, placeHolderText } = props

    const [list, setList]: any = useState([])
    const [input, setInput]: any = useState("")

    const value = JSON.parse(localStorage.getItem(keyName) || '""')

    useEffect(() => {
        if (value != "") {
            setList(value)
        }

    }, []);

    //update list to localstorage and clear input box
    function addToList() {
        if(input.trim() == "") {
            alert("Input field cannot be empty.")
        } else if(list.includes(input)) {
            alert("This is a duplicate entry.")
        } else {
            setList([...list, input])
            localStorage.setItem(keyName, JSON.stringify([...list, input]))
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
            <input
                type='text'
                id='group'
                value={input}
                placeholder={placeHolderText}
                onChange={(e) => setInput(e.target.value)}
            />

            <button onClick={() => addToList()}>Add</button>

            <div className="feed-container">
                {list.map((item: any) => (
                    <FeedItem
                        item={item}
                        deleteFunction={deleteFromList}
                    ></FeedItem>
                ))}
            </div>
        </div>

    )
}

export default Feed;