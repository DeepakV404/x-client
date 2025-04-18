

const BS_Badge = (props: {
    color?  :   string,
    size?   :   string,
    shape?  :   "circle" | "square",
    text?   :   string,
    space?  :   string,
    radius? :   string 
}) => {

    const { 
        color   =   "#0065E5",
        size    =   "5px",
        shape   =   "circle",
        text    =   "",
        space   =   "8px",
        radius  =   "5px"
    }   =   props

    return (
        <div className="cm-flex-align-center" style={{columnGap: space}}>
            <div style={{background: color, width: size, height: size, borderRadius: shape === "circle" ? "50%" : radius}} ></div>
            <div style={{lineHeight: "12px"}}>{text}</div>
        </div>
    )
}

export default BS_Badge