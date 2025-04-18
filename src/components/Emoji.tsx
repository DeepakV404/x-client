import { FC } from "react";

interface EmojiProps
{
    font        :   string,
    size?       :   string,
    color?      :   string,
    className?  :   string,
    filled?     :   boolean
    onClick?    :   () => void
}

const Emoji : FC<EmojiProps> = ({ font, size ="inherit", color, className="", filled=false, onClick }) => {

    return <span onClick={onClick} className={ "cm-font " + ( filled ? "filled " : "") + className } style={{fontSize: `${size}px`, color: color}}>{font}</span>
}

export default Emoji;