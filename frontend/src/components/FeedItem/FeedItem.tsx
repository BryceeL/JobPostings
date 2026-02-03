import "./FeedItem.css"

type propTypes = {
    item: string
    deleteFunction: Function
    incrementIndexFunction: Function
}

function FeedItem(props : propTypes) {
    const {item, deleteFunction, incrementIndexFunction} = props

    return (
        <div className="item-container">
            <p>{item}</p>
            <button
                onClick={() => incrementIndexFunction(item,"up")}>↑</button>
            <button
                onClick={() => incrementIndexFunction(item,"down")}>↓</button>
            <button
                onClick={() => deleteFunction(item)}
            >X</button>
        </div>
    )
}

export default FeedItem