import { useState } from 'react';
import { Worker } from '@react-pdf-viewer/core';
import { useQuery } from "@apollo/client";
import { Layout } from "antd";

import { CommonUtil } from "../utils/common-util";
import { HUBSPOT_ROOMS } from "./api/hubspot-query";

import SelectRoom from "./distribution/select-room";
import Loading from "../utils/loading";

import packageJson from '../../package.json';
import HubspotError from './hubspot-error';
import AppLayout from "../layout";
import Globals from '../globals';
import "./hubspot.css"

const HubspotApp = () => {

    const pdfjsVersion = packageJson.dependencies["pdfjs-dist"];

    const [currentView, setCurrentView] =   useState("empty");

    const { data, loading, error } =   useQuery(HUBSPOT_ROOMS, {
        variables: {
            page    :   CommonUtil.__getQueryParams(window.location.search).page,
            id      :   CommonUtil.__getQueryParams(window.location.search).id,
            emailId :   CommonUtil.__getQueryParams(window.location.search).email ? CommonUtil.__getQueryParams(window.location.search).email : "",
        }
    })

    if(loading) return <Loading/>
    if(error) return <HubspotError error={error}/>

    let rooms   =   data?._hsGetRooms;
    let code    =   data?._hsGetRooms?.code;

    const getComponent = () => {
        if(currentView === "library" || currentView === "links"){
            return (
                <Globals>
                    <>
                        <div style={{height: "calc(100% - 25px)"}} className='cm-width100'>
                            <AppLayout currentView={currentView} code={code} setCurrentView={setCurrentView} hsRoomId={rooms?.mappedRoom?.uuid} hsAccountId={rooms?.mappedRoom?.buyerAccount?.uuid}/>
                        </div>
                    </>
                </Globals>
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
                                <AppLayout currentView={currentView} code={code} setCurrentView={setCurrentView} hsRoomId={rooms?.mappedRoom?.uuid} hsAccountId={rooms?.mappedRoom?.buyerAccount?.uuid}/>
                            </div>
                        </>
                    </Globals>
                )
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

export default HubspotApp