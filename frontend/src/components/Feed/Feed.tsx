import { useState, useEffect } from 'react';
import FeedItem from "../FeedItem/FeedItem";

import "./Feed.css"

type feedTypes = {
    keyName: string,
    placeHolderText: string
}

function Feed(props: feedTypes) {
    const { keyName, placeHolderText } = props

    const [list, setList] = useState<string[]>([])
    const [input, setInput] = useState<string>("")

    const value = JSON.parse(localStorage.getItem(keyName) || '[]')

    useEffect(() => {
        if (value != 0) {
            setList(value)
        }

    }, []);

    //update list to local storage and clear input box
    function addToList() {     
        if(input.trim() == "") {
            alert("Input field cannot be empty.")
        } else if(list.includes(input)) {
            alert("This is a duplicate entry.")
        } else {
            setList([input, ...list])
            localStorage.setItem(keyName, JSON.stringify([input, ...list]))
            setInput("")
        }
    }

    //deletes item by filtering the list without the said item
    function deleteFromList(deleteItem: string) {
        const newList: any = list.filter((item: string) => {
            return item != deleteItem
        })
        setList(newList)
        localStorage.setItem(keyName, JSON.stringify(newList))
    }

    //Change the item's index to move said item up or down the list
    function incrementItemIndex(incrementItem: string, incrementType: string) {
        setList(prevList => {
            const prevItemIndex = prevList.indexOf(incrementItem)
            const newList = prevList.filter(item => item != incrementItem)

            if (incrementType == "up" && prevItemIndex != 0) {
                newList.splice(prevItemIndex-1, 0, incrementItem)
            } else if (incrementType == "down" && prevItemIndex != newList.length+1) {
                newList.splice(prevItemIndex+1, 0, incrementItem)
            } else {
                newList.splice(prevItemIndex, 0, incrementItem)
            }

            localStorage.setItem(keyName, JSON.stringify(newList))
            return newList
        })
    }

    return (
        <div className='feed'>
            <div className='button-container'>
                <input
                    type='text'
                    id='group'
                    value={input}
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
                            incrementIndexFunction={incrementItemIndex}
                        ></FeedItem>
                    ))}
                </div>
                
            </div>
        </div>

    )
}

export default Feed;