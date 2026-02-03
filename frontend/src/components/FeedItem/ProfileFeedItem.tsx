import "./FeedItem.css"

type propTypes = {
    item: any
    profileName: string
    deleteFunction: any
    clickFunction: any
}

function FeedItem(props : propTypes) {
    const {item, profileName, deleteFunction, clickFunction} = props

    return (
        <div className={"item-container"}>
            <button
                onClick={() => clickFunction(item)}
            >{profileName}</button>
            <button
                onClick={() => deleteFunction(item)}
            >X</button>
        </div>
    )
}

export default FeedItem