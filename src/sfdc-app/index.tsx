import { Worker } from '@react-pdf-viewer/core';
import { Layout } from "antd";
import { useQuery } from "@apollo/client";
import { useContext, useState } from 'react';

import { SFDCGlobalContext } from './sfdc-globals';
import { CommonUtil } from "../utils/common-util";
import { SFDC_ROOMS } from "./api/sfdc-query";

import SelectRoom from "./distribution/select-room";
import Loading from "../utils/loading";

import packageJson from '../../package.json';
import SFDCError from "./sfdc-error";
import AppLayout from "../layout";
import Globals from '../globals';
import Account from './account';
import "./sfdc.css"

const SFDCApp = () => {

    const { $orgDetail }    =   useContext(SFDCGlobalContext);

    const pdfjsVersion = packageJson.dependencies["pdfjs-dist"];

    const [currentView, setCurrentView] =   useState("empty");

    const page = CommonUtil.__getQueryParams(window.location.search).page;

    const { data, loading, error } =   useQuery(SFDC_ROOMS, {
        skip        :   page === "account",
        variables   :   {
            page    :   CommonUtil.__getQueryParams(window.location.search).page,
            id      :   CommonUtil.__getQueryParams(window.location.search).id,
            emailId :   CommonUtil.__getQueryParams(window.location.search).email ? CommonUtil.__getQueryParams(window.location.search).email : "",
        }
    })
    
    if(loading) return <Loading/>
    if(error) return <SFDCError error={error}/>
    
    let rooms   =   data?._sfdcGetRooms;
    let code    =   data?._sfdcGetRooms.code;
    
    const libraryURL    =   `${import.meta.env.VITE_APP_DOMAIN}/${$orgDetail.tenantName}/#/library/all-resources`;
    const linksURL      =   `${import.meta.env.VITE_APP_DOMAIN}/${$orgDetail.tenantName}/#/links`;

    const getComponent = () => {
        if(currentView === "library" || currentView === "links"){
            return (
                <Globals>
                    <>
                        <div style={{height: "calc(100% - 25px)"}} className='cm-width100'>
                            <AppLayout currentView={currentView} code={code} setCurrentView={setCurrentView} sfdcRoomId={rooms?.mappedRoom?.uuid} sfdcAccountId={rooms?.mappedRoom?.buyerAccount?.uuid}/>
                        </div>
                    </>
                </Globals>
            )
        }else{
            if(page === "account"){
                return (
                   <Account libraryURL={libraryURL} linksURL={linksURL}/>
                )
            }else{
                if(code === 20001 || code === 20002){
                    return (
                        <SelectRoom setCurrentView={setCurrentView} availableRooms={rooms.availableRooms} accountRooms={rooms.accountRooms}/>
                    )
                }else if(code === 20003){
                    return (
                        <Globals>
                            <>
                                <div style={{height: "calc(100% - 25px)"}} className='cm-width100'>
                                    <AppLayout setCurrentView={setCurrentView} sfdcRoomId={rooms.mappedRoom.uuid} sfdcAccountId={rooms.mappedRoom.buyerAccount.uuid}/>
                                </div>
                            </>
                        </Globals>
                    )
                }
            }
        }
    }

    return (
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}>
            <Layout className="cm-height100 cm-flex-center">
                {getComponent()}
            </Layout>
        </Worker>
    )
}

export default SFDCApp