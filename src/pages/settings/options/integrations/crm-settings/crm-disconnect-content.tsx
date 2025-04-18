import { Button, Input, InputRef, Space } from "antd";
import MaterialSymbolsRounded from "../../../../../components/MaterialSymbolsRounded";
import { useEffect, useRef, useState } from "react";

const CRMDisconnectContent = (props: { onOk: () => void, onCancel: () => void, header?: string, body? : string}) => {

    const { onOk, onCancel, header, body}      =     props;

    const [inputValue, setInputValue]         =    useState("");
    const [loadingState, setLoadingState]     =   useState({
          loading: false,
          text: "Disconnect"
    });

    const inputRef              =   useRef<InputRef>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleEnter = (event: any) => {
        if(event.keyCode === 13 && inputValue === "Disconnect"){
            setLoadingState({ loading: true, text: "Disconnecting..." });
            onOk();
        }
    }
    
    return (
        <div className='cm-width100'>
            <Space className='cm-modal-header cm-flex-align-center'>
                <MaterialSymbolsRounded font="Error" color='#DF2222'/>
                <div className='cm-font-fam600 cm-font-size16'>{header}</div>
            </Space>
            <Space direction='vertical' className='cm-modal-content' size={15} style={{width: "calc(100% - 30px)"}}>
                <div className='cm-margin-bottom10'>{body}</div>
                <div className='cm-font-fam500'>
                    Important Note: 
                    <ul>
                        <li>
                            Room and deal mappings will be permanently deleted.
                        </li>
                        <li>
                            All HubSpot-to-Buyerstage stage mappings will be removed.
                        </li>
                        <li>
                            This action cannot be undone.
                        </li>
                    </ul>
                </div>
                <div className='cm-secondary-text'>Please type "<span className='cm-font-fam500 cm-dark-text'>Disconnect</span>" below to confirm.</div>
                <Input ref={inputRef} className="cm-width100" placeholder="Disconnect" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(event) => handleEnter(event)}/>
            </Space>
            <div className='cm-modal-footer'>
                <Space className='cm-width100 cm-margin-top15 cm-flex-justify-end'>
                    <Button ghost style={{color: "black", borderColor: "#E8E8EC"}} onClick={(event) => {event.stopPropagation(); onCancel()}}>Cancel</Button>
                    <Button disabled={inputValue !== "Disconnect"} style={inputValue === "Disconnect" ? { backgroundColor: "#FF4D4F", color: "#fff", border: "1px solid #FF4D4F"} : {}} onClick={(event) => {event.stopPropagation(); setInputValue(""); setLoadingState({ loading: true, text: "Disconnecting..." }); onOk();}} loading={loadingState.loading}>
                        {loadingState.text}
                    </Button>
                </Space>
            </div>
      </div>
    )
}

export default CRMDisconnectContent
