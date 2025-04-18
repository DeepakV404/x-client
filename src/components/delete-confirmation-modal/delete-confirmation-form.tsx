import { Button, Input, InputRef, Space } from "antd";
import MaterialSymbolsRounded from "../MaterialSymbolsRounded";
import { useEffect, useRef, useState } from "react";
import _ from 'lodash';

const DeleteConfirmationForm = (props: { isOpen: boolean, modifiedContent: any, apiDetails?: any, onOk: any, onCancel: any, otherReqInfo?: any }) => {

    const { isOpen, modifiedContent, onOk, onCancel } = props

    const [inputValue, setInputValue] = useState("");
    const [submitText, setSubmitText] = useState({
        loading: false,
        text: "Delete"
    })

    const inputRef = useRef<InputRef>(null);

    useEffect(() => {
        if (isOpen) {
            setSubmitText({ loading: false, text: "Delete" });
            setInputValue("");
        }
    }, [isOpen]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleEnter = (event: any) => {
        if(event.keyCode === 13 && inputValue === "Delete"){
            setSubmitText({ loading: true, text: "Deleting" });
            onOk()
        } 
    }

    return (
        <div className='cm-width100'>
            <Space className='cm-flex-align-center' style={{ padding: "15px", borderBottom: "1px solid #0769E71F" }}>
                <MaterialSymbolsRounded font="Error" color='#DF2222' />
                <div className='cm-font-fam600 cm-font-size16'>Delete {modifiedContent.module}</div>
            </Space>
            <Space direction='vertical' className='cm-modal-content' size={15}>
                <div>Are you sure you want to delete this <span className="cm-font-fam500">{_.toLower(modifiedContent.module)}</span> ? This cannot be undone.</div>
                <div className='cm-font-fam500'>{modifiedContent?.cautionMessage}</div>
                <div className='cm-secondary-text'>Please type <span className="cm-font-fam500">"Delete"</span> to delete this {_.toLower(modifiedContent.module)} permanently</div>
                <Input ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => handleEnter(e)} />
            </Space>
            <div className='cm-modal-footer'>
                <Space className='cm-width100 cm-margin-top15 cm-flex-justify-end'>
                    <Button ghost style={{ color: "black", borderColor: "#E8E8EC" }} onClick={(event) => { event.stopPropagation(); onCancel() }} disabled={submitText.loading}>Cancel</Button>
                    <Button disabled={inputValue !== "Delete"} style={inputValue === "Delete" ? { backgroundColor: "#FF4D4F", color: "#fff", border: "1px solid #FF4D4F" } : {}} onClick={(event) => { event.stopPropagation(); onOk(); setSubmitText({ loading: true, text: "Deleting" }) }} loading={submitText.loading}>
                        {submitText.text}
                    </Button>
                </Space>
            </div>
        </div>
    )
}

export default DeleteConfirmationForm