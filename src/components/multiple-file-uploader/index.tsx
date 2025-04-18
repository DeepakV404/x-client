import { useContext, useEffect, useState } from "react";
import { Space, Typography } from "antd";

import { GlobalContext } from "../../globals";

import MaterialSymbolsRounded from "../MaterialSymbolsRounded";
import Loading from "../../utils/loading";

const { Text }  =   Typography

const MultipleFileUploadIndicator = () => {

    const { $fileListProps }   =   useContext<any>(GlobalContext);

    const { fileListForMultipleUpload, setFileListForMultipleUpload } = $fileListProps;

    const [fullyVisible, setFullyVisible]           =   useState(true)
    const [componentVisible, setComponentVisible]   =   useState(true)

    const isResourceUploadedSuccessfully            =   fileListForMultipleUpload?.every((item: any) => item.status === "completed");    

    useEffect(() => {
        let timerToUnmountUploadComponent: number | undefined;
    
        if (isResourceUploadedSuccessfully) {
            timerToUnmountUploadComponent = window.setTimeout(() => {
                setComponentVisible(false);
                setFileListForMultipleUpload(null)
            }, 30000);
        }
    
        return () => {
            if (timerToUnmountUploadComponent !== undefined) {
                window.clearTimeout(timerToUnmountUploadComponent);
            }
        };
    }, [isResourceUploadedSuccessfully]);
    
    return (
        <>
            {
                componentVisible &&
                    <div className="cm-position-absolute j-multiple-resource-bar cm-background-white" style={{bottom: 0, right: "50px", zIndex: 1300, height: fileListForMultipleUpload.length > 4 && fullyVisible ? "235px" : "auto"}}>
                        <div className="cm-flex-space-between" style={{padding: "10px 20px", background: "#161A30", borderRadius: "4px 4px 0 0"}}>
                            <div className="cm-flex-align-center">
                                {isResourceUploadedSuccessfully && (
                                    <>
                                        <div className="j-tick-wrapper" style={{ height: "18px", aspectRatio: 1, marginRight: "8px" }}>
                                            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                                            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                                            </svg>
                                        </div>
                                    </>
                                )}
                                {`${fileListForMultipleUpload?.filter((item: any) => item.status === "completed").length} / ${fileListForMultipleUpload?.length} uploaded successfully`}
                            </div>
                            <Space className="cm-flex-justify-center">
                                <div className="cm-cursor-pointer" onClick={() => setFullyVisible((prev) => !prev)}>{fullyVisible ? <MaterialSymbolsRounded font="stat_minus_1"/> : <MaterialSymbolsRounded font="keyboard_arrow_up"/>}</div>
                                <div className="cm-flex-align-center cm-cursor-pointer" onClick={() => {setComponentVisible(false); setFileListForMultipleUpload([])}}>
                                    <MaterialSymbolsRounded font="close" size="22"/>
                                </div>
                            </Space>
                        </div>
                        {
                            fullyVisible &&
                                <div className="cm-background-white" style={{color: "black",height: "calc(100% - 50px)", overflowY: "auto"}}>
                                    <div className="cm-padding10">
                                        {
                                            fileListForMultipleUpload?.map((item: any, index: number) => (
                                                <div key={item.uid} className="cm-flex-space-between" style={{borderBottom: index < fileListForMultipleUpload?.length - 1 ? "1px solid #E8E8EC" : "", padding: "7px"}}>
                                                    <Text ellipsis={{tooltip: item.name}} style={{width: "225px"}} className="cm-font-fam500">{item.name}</Text>
                                                    <div style={{height: "20px", aspectRatio: 1}}>
                                                        {
                                                            item.status === "uploading" 
                                                            ?
                                                                <Loading color="#0065E5"/>
                                                            :
                                                                <div className="j-tick-wrapper"> <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/> <path className="" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg></div>
                                                        }
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                        }
                    </div>
            }
        </>
    )
}

export default MultipleFileUploadIndicator