import { useState, useEffect } from 'react'
import "./WebElementInput.css"

type propDataTypes = {
    text: string,
    placeHolderText: string,
    keyName: string,
}

function WebElementInput(props: propDataTypes) {
    const { text, placeHolderText, keyName } = props

    const [input, setInput]: any = useState("")

    const value = JSON.parse(localStorage.getItem(keyName) || '[]')

    useEffect(() => {
        if (value != "" && value != placeHolderText) {
            setInput(value)
        }
    }, [])

    useEffect(() => {
        if (input != "") {
            localStorage.setItem(keyName, JSON.stringify(input))
        } else {
            localStorage.setItem(keyName, JSON.stringify(placeHolderText))
        }
    }, [input])

    return (
        <div className='web-input'>
            <div className='text-container'>{text}</div>
            <input
                type='text'
                id='group'
                value={input}
                placeholder={placeHolderText}
                onChange={(e) => setInput(e.target.value)}
            />

        </div>
    )
}

export default WebElementInput