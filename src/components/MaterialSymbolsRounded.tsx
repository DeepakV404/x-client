import { FC } from "react";

interface MaterialSymbolsRoundedProps
{
    font        :   string,
    size?       :   string,
    color?      :   string,
    className?  :   string,
    filled?     :   boolean,
    onClick?    :   (arg0: any) => void,
    weight?     :   string;
}

const MaterialSymbolsRounded : FC<MaterialSymbolsRoundedProps> = ({ font, size ="inherit", color, className="", filled=false, onClick, weight= 300 }) => {

    return <span translate="no" onClick={(event) => onClick ? onClick(event) : null} className={ "material-symbols-rounded material-icons cm-font " + ( filled ? "filled " : "") + className } style={{fontSize: `${size}px`, color: color, fontWeight: weight }}>{font}</span>
}

export default MaterialSymbolsRounded;