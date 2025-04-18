import { useRef, useState, useEffect, useContext } from 'react';
import { SpecialZoomLevel, Viewer } from '@react-pdf-viewer/core';
import { useMutation } from '@apollo/client';

import { D_TrackDeckResource } from '../API/deck-mutation';
import { DeckValuesContext } from '..';

const DeckPdfViewer = (props: { resource: any, toolbarPluginInstance: any }) => {
    
    const { resource, toolbarPluginInstance } = props;

    const {selectedCard, isMobile }   =   useContext(DeckValuesContext)

    const [trackResource] = useMutation(D_TrackDeckResource, {
        fetchPolicy: "network-only",
    });

    const PDFTrackingDataRef   =   useRef({
        startedAt           :   null as number | null,
        durationSpentInSecs :   0,
    });

    const [currentPage, setCurrentPage] =   useState(0);
    const viewerRef                     =   useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if(!entry.isIntersecting && PDFTrackingDataRef.current.startedAt && selectedCard === resource.uuid) {
                    trackResource({
                        variables: {
                            input: {
                                resourceUuid        :   resource.uuid,
                                isViewed            :   true,
                                page                :   currentPage,
                                durationSpentInSecs :   Math.ceil((Date.now() - PDFTrackingDataRef.current.startedAt) / 1000),
                            },
                        },
                    })
                } else {
                    PDFTrackingDataRef.current = {
                        startedAt: Date.now(),
                        durationSpentInSecs: 0
                    };
                }
            },
            { threshold: 0.1 }
        );

        if (viewerRef.current) {
            observer.observe(viewerRef.current);
        }

        return () => {
            if (viewerRef.current) {
                observer.unobserve(viewerRef.current);
            }
        };
    }, [currentPage, selectedCard])

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && PDFTrackingDataRef.current.startedAt && selectedCard === resource.uuid) {
                trackResource({
                    variables: {
                        input: {
                            resourceUuid        :   resource.uuid,
                            isViewed            :   true,
                            page                :   currentPage,
                            durationSpentInSecs :   Math.ceil((Date.now() - PDFTrackingDataRef.current.startedAt) / 1000),
                        },
                    },
                })
            } else if(document.visibilityState === 'visible' && selectedCard === resource.uuid) {
                PDFTrackingDataRef.current = {
                    startedAt: Date.now(),
                    durationSpentInSecs: 0
                };
            }
        };
    
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('beforeunload', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('beforeunload', handleVisibilityChange);
        };
    }, [currentPage, selectedCard])

    // HandlePage change is called only for multi page 
    const handlePageChange = (event: any) => {   
        if (PDFTrackingDataRef.current.startedAt !== null && currentPage > 0) {
            trackResource({
                variables: {
                    input: {
                        resourceUuid        :   resource.uuid,
                        isViewed            :   true,
                        page                :   currentPage,
                        durationSpentInSecs :   Math.ceil((Date.now() - PDFTrackingDataRef.current.startedAt) / 1000),
                    },
                },
            });
        }
        PDFTrackingDataRef.current.startedAt = Date.now();
        PDFTrackingDataRef.current.durationSpentInSecs = 0;
        setCurrentPage(event.currentPage + 1);
    };

    return (
        <div ref={viewerRef} className="j-deck-pdf-layout">
            <Viewer
                fileUrl         =   {resource.content.url}
                plugins         =   {[toolbarPluginInstance]}
                defaultScale    =   {isMobile ? SpecialZoomLevel.PageWidth : SpecialZoomLevel.ActualSize}
                onPageChange    =   {handlePageChange}
            />
        </div>
    );
};

export default DeckPdfViewer;
