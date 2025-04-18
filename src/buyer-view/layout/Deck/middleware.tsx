import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Worker } from '@react-pdf-viewer/core';

import { DECK_PORTAL } from '../../buyer-router';
import { D_CREATE_CONTACT_MAPPING } from './API/deck-mutation';

import packageJson from '../../../../package.json';
import Loading from '../../../utils/loading';
import DeckResourcesOverview from '.';

const BuyerDeckViewMiddleware = () => {

    const pdfjsVersion          =   packageJson.dependencies["pdfjs-dist"];
    const [createMapping]       =   useMutation(D_CREATE_CONTACT_MAPPING);

    const searchParams          =   new URLSearchParams(window.location.search);
    const paramsObject          =   Object.fromEntries(searchParams.entries());

    const hasCalledMutation     =   useRef(false);

    const [loading, setLoading] =   useState(true);

    if(paramsObject.ref === "reshare"){
        delete paramsObject.ref;
    }

    useEffect(() => {
        setLoading(true)
        if (!hasCalledMutation.current) {
            createMapping({
                variables: {
                    campaignInfo: paramsObject
                },
                onCompleted: () => {
                    setLoading(false)
                }
            });
            hasCalledMutation.current = true;
        }
    }, []);

    if(loading) return <Loading/>

    return (
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}>
            <DeckResourcesOverview key={DECK_PORTAL} />
        </Worker>
    )
};

export default BuyerDeckViewMiddleware;
