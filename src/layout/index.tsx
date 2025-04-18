import { createContext, useContext, useEffect, useState } from "react";
import { HashRouter } from "react-router-dom";
import { Worker } from '@react-pdf-viewer/core';
import { Layout } from "antd";

import { AppTracker } from "../app-tracker";
import { GlobalContext } from "../globals";

import AppHeader from "./app-header";   
import AppBody from "./app-body";
import "./layout.css";

import packageJson from '../../package.json';
import MultipleFileUploadIndicator from "../components/multiple-file-uploader";
import { CommonUtil } from "../utils/common-util";

export const AppContext = createContext<any>(null);

function AppLayout(props: {currentView?: any, code?: any, setCurrentView?: any, sfdcRoomId?: string, sfdcAccountId?: string, hsAccountId?: string, hsRoomId?: string, domain?: string}){

    const { code, currentView, setCurrentView, sfdcRoomId, sfdcAccountId, hsRoomId, hsAccountId }    =   props;
    
    const pdfjsVersion = packageJson.dependencies["pdfjs-dist"];
    
    const { $user, $fileListProps }         =   useContext(GlobalContext);
    
    const { fileListForMultipleUpload }     =   $fileListProps;

    const restrictIntercomAccounts      =   ["buyerstage.io"];
    const exceptionalEmails             =   ["vish+2@buyerstage.io", "sathish+dev@buyerstage.io"]

    const [fromPath, setFromPath]   =   useState("");
    
    const appContext: any = {
        code            :   code,
        currentView     :   currentView,
        setCurrentView  :   setCurrentView,
        fromPath        :   fromPath,
        sfdcRoomId      :   sfdcRoomId,
        sfdcAccountId   :   sfdcAccountId,
        hsRoomId        :   hsRoomId,
        hsAccountId     :   hsAccountId
    }

    const getClass = () => {
        if(CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app"){
            return "sfdc cm-height100 cm-width100"
        }else if(CommonUtil.__getSubdomain(window.location.origin) === "hs-app"){
            return "hubspot cm-height100 cm-width100"
        }else return "cm-height100"
    }

    useEffect(() => {
        if(!import.meta.env.DEV && !(CommonUtil.__getSubdomain(window.location.origin) === "hs-app" || CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app")){
            if(exceptionalEmails.includes($user.emailId)){
                AppTracker.initialize($user)
            }else if(!restrictIntercomAccounts.includes($user.emailId.split("@")[1])){
                AppTracker.initialize($user)
            }
        }
    }, [])

    return(
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}>
            <Layout className={getClass()}>
                <HashRouter>
                    {/* {
                        $showHeader && 
                            <div className='j-app-banner cm-flex-center'>
                                <Space size={20}>
                                    <MaterialSymbolsRounded font="auto_awesome" filled/>
                                    <div className="cm-font-size15 cm-font-fam500" style={{letterSpacing: "0.3px"}}>Digital Sales Kick-Off: Lock the Flat Fee for Lifetime</div>
                                    <Space className="cm-cursor-pointer j-app-banner-cta" onClick={() => window.open(MEET_WITH_BUYERSTAGE, "_blank")}>
                                        <span className="cm-font-fam500">Explore now</span>
                                        <MaterialSymbolsRounded font="arrow_forward" size="20" weight="600"/>
                                    </Space>
                                </Space>
                            </div>
                    } */}
                    <AppHeader 
                        setFromPath     =   {setFromPath} 
                        hsRoomId        =   {hsRoomId} 
                        hsAccountId     =   {hsAccountId}
                        sfdcRoomId      =   {sfdcRoomId}
                        sfdcAccountId   =   {sfdcAccountId}
                        currentView     =   {currentView}
                        setCurrentView  =   {setCurrentView}

                    />
                    <AppContext.Provider value={appContext}>
                        <AppBody/>
                    </AppContext.Provider>
                </HashRouter>
                {
                    fileListForMultipleUpload?.length > 0 && <MultipleFileUploadIndicator />
                } 
            </Layout>
        </Worker>
    );
}

export default AppLayout;