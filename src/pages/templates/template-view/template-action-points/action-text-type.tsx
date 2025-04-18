import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { debounce } from 'lodash';

import { TemplateActionPointContext } from "./template-action-point";
import { RoomTemplateAgent } from "../../api/room-template-agent";

import RichTextEditor from "../../../../components/HTMLEditor/rt-editor";

const ActionTextType = () => {

    const { roomTemplateId }        =   useParams();
    const { actionPoint }           =   useContext(TemplateActionPointContext);

    const [loading, setLoading]     =   useState(false);
    const [saved, setSaved]         =   useState(false);

    const handleContentChangeChange = (debounce((value: string) => {
        setLoading(true)
        RoomTemplateAgent.rtUpdateTextContentInActionPoint({
            variables: {
                templateUuid    :   roomTemplateId,
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