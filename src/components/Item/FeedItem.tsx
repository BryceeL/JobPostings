import "./FeedItem.css"

type propTypes = {
    item: string
    deleteFunction: any
}

function FeedItem(props : propTypes) {
    const {item, deleteFunction} = props

    return (
        <div className="item-container">
            <p>{item}</p>
            <button
                onClick={() => deleteFunction(item)}
            >X</button>
        </div>
    )
}

export default FeedItem