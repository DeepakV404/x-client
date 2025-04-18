import { Popover } from "antd"
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded"
import WidgetComment from "./widget-comment"
import { useState } from "react"

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
            <MaterialSymbolsRounded color='#1F1F1F' className="cm-cursor-pointer" font="mode_comment" size="20" onClick={() => setPopupOpen(true)}/>
        </Popover>
    )
}

export default WidgetComments