import { Popover } from "antd"
import { useState } from "react"
import MaterialSymbolsRounded from "../../../../../components/MaterialSymbolsRounded"
import WidgetComment from "./widget-comment"

const WidgetComments= (props: {widget: any }) => {

const [popupOpen, setPopupOpen]   =   useState(false)

return (
        <Popover
            rootClassName   =   "j-discovery-q-initial-popup"
            open            =   {popupOpen}
            onOpenChange    =   {() => setPopupOpen(false)}
            content         =   {<WidgetComment {...props} />}
            trigger         =   {"click"}
            arrow           =   {false}
            placement="leftTop"
        >
            <MaterialSymbolsRounded className="cm-cursor-pointer" font="mode_comment" size="18" onClick={() => setPopupOpen(true)}/>
        </Popover>
    )
}

export default WidgetComments