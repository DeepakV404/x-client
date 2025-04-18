import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { debounce } from 'lodash';

import { ActionPointViewContext } from ".";
import { RoomsAgent } from "../api/rooms-agent";

import RichTextEditor from "../../../components/HTMLEditor/rt-editor";

const ActionTextType = () => {

    const { roomId }        =   useParams();
    const { actionPoint }   =   useContext(ActionPointViewContext);

    const [loading, setLoading]     =   useState(false);
    const [saved, setSaved]         =   useState(false);

    const handleContentChangeChange = (debounce((value: string) => {
        setLoading(true)
        RoomsAgent.updateTextContentInActionPoint({
            variables: {
                roomUuid        :   roomId,
                actionPointUuid :   actionPoint.uuid,
                textContent     :   value ?? "",
            },
            onCompletion: () => {
                setLoading(false)
                setSaved(true)
                setTimeout(() => {
                    setSaved(false)
                }, 2000)
            },
            errorCallBack: () => {
                setLoading(false)
                setSaved(false)
            }
        })
    }, 1500))

    return(
        <div className="cm-padding15">  
            <div className="cm-margin-bottom10 cm-font-fam500">Note: </div>
            <RichTextEditor loading={loading} saved={saved} showSave={true} onChange={handleContentChangeChange} value={actionPoint?.textContent && actionPoint?.textContent || '<p></p>'}/>
        </div>
    )
}

export default ActionTextType