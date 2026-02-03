import { useState, useEffect } from 'react';
import ProfileFeedItem from "../FeedItem/ProfileFeedItem";

import "./Feed.css"

type feedTypes = {
    keyName: string,
    placeHolderText: string
}

function ProfileFeed(props: feedTypes) {
    const { keyName, placeHolderText } = props

    const [currentProfile, setCurrentProfile]: any = useState(0)
    const [profileList, setProfileList]: any = useState([])
    const [input, setInput]: any = useState("")

    const LScurrentProfile = JSON.parse(localStorage.getItem("currentProfile") || '0')
    const LSprofileList = JSON.parse(localStorage.getItem("profileList") || '[]')

    useEffect(() => {
        if (LScurrentProfile != "") {
            setCurrentProfile(LScurrentProfile)
        }
        if (LScurrentProfile != "") {
            setProfileList(LSprofileList)
        }
        
    }, [])

    useEffect(() => {
        localStorage.setItem("currentProfile", currentProfile)
    }, [currentProfile])

    useEffect(() => {
        localStorage.setItem("profileList", JSON.stringify(profileList))
    }, [profileList])

    //update list to local storage and clear input box
    function addToList() {
        if(input.trim() == "") {
            alert("Input field cannot be empty.")
        // } else if(list.includes(input)) {
        //     alert("This is a duplicate entry.")
        } else {
            setProfileList([...profileList, profileList.length+1])

            localStorage.setItem(String(profileList.length+1), 
            JSON.stringify(
                {
                    profileName: input,
                    districts: JSON.parse(localStorage.getItem("districts") || '[]'),
                    keywords: JSON.parse(localStorage.getItem("keywords") || '[]'),
                    webDomain: JSON.parse(localStorage.getItem("webDomain") || '[]'),
                    institutionTitleContainerName: JSON.parse(localStorage.getItem("institutionTitleContainerName") || '[]'),
                    institutionTitleElementName: JSON.parse(localStorage.getItem("institutionTitleElementName") || '[]'),
                    jobContainerName: JSON.parse(localStorage.getItem("jobContainerName") || '[]'),
                    jobTitleName: JSON.parse(localStorage.getItem("jobTitleName") || '[]'),
                }
            ))
            setInput("")
        }
        
    }

    //return items from the list except 'deleteItem'
    function deleteFromList(deleteItem: string) {
        const newList: any = profileList.filter((item: string) => {
            return item != deleteItem
        })
        setProfileList(newList)
        setCurrentProfile(1)
        localStorage.setItem(keyName, JSON.stringify(newList))
        localStorage.removeItem(deleteItem)
    }

    function clickedProfile(item: string) {
        setCurrentProfile(item)
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

                <button onClick={() => addToList()}>Add</button>
            </div>
            
            <div className="feed-container">
                <div className='scroll'>
                    {profileList.map((item: any) => (
                        <ProfileFeedItem
                            item={item}
                            profileName={item}
                            deleteFunction={deleteFromList}
                            clickFunction={clickedProfile}
                        ></ProfileFeedItem>
                    ))}
                </div>
                
            </div>
        </div>

    )
}

export default ProfileFeed;