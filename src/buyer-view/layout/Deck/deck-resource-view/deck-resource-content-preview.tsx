import { useContext, useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";

import { D_TrackDeckResource } from "../API/deck-mutation";
import { DeckValuesContext } from "..";

import DeckResource from "./deck-resource";
import { LINK, VIDEO } from "../../../../pages/library/config/resource-type-config";
import { CommonUtil } from "../../../../utils/common-util";

interface TrackingData {
    uuid?: string | null;
    startedAt?: number | null;
    durationSpentInSecs?: number | null;
}

interface ResourceContent {
    downloadableUrl: string;
    extension: string;
    thumbnailUrl: string;
}
  
  interface ResourceCardProps {
    uuid: string;
    title: string;
    content: ResourceContent;
    type: string;
    description: string | null;
}

const DeckResourceContentPreview = () => {

    const { selectedCard, resourceData, setSelectedCard } = useContext(DeckValuesContext);

    const resRef            =   useRef<(HTMLAnchorElement | null)[]>([]);
    const observerRef       =   useRef<IntersectionObserver | null>(null);
    const timeoutRef        =   useRef<any>(null);
    const lastActivityRef   =   useRef(Date.now());

    const trackingDataRef   =   useRef<TrackingData>({
        uuid                :   selectedCard?.toString(),
        startedAt           :   null,
        durationSpentInSecs :   null
    });

    const [trackResource]   =   useMutation(D_TrackDeckResource, {
        fetchPolicy: "network-only",
    });

    useEffect(() => {
        if (selectedCard !== null && resRef.current) {
            const activeElement = resRef.current.find(el => el?.classList.contains("active"));

            if (activeElement) {
                setTimeout(() => {
                    activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100)
            }
        }
    }, [selectedCard]);

    // This use effect is used track isViewed for all the resource types
    // This use effect is used track the duration for the resources other than PDF and Videos that are loaded in the React Player

    useEffect(() => {
        const selectedResource = resourceData?._dBuyerDeckResources.filter((card: ResourceCardProps) => card.uuid === selectedCard)[0];

        if(selectedResource.type === VIDEO) return

        trackingDataRef.current.startedAt   =   Date.now()

        trackResource({
            variables: {
                input: {
                    resourceUuid: selectedCard,
                    isViewed: true,
                }
            }
        })

        return () => {

            if (selectedResource && selectedResource.content.extension !== "PDF" && selectedResource.type !== VIDEO && !(selectedResource.type === LINK && CommonUtil.__checkVideoDomain(selectedResource.content.url)) && trackingDataRef.current.startedAt) {
                trackResource({
                    variables: {
                        input: {
                            resourceUuid: selectedCard,
                            startedAt: trackingDataRef.current.startedAt,
                            durationSpentInSecs: Math.ceil((Date.now() - trackingDataRef.current.startedAt) / 1000),
                        }
                    }
                });
            }
        }
    }, [selectedCard, resourceData])

    // Used to track if user changes tab

    useEffect(() => {
        const handleVisibilityChange = () => {
                
            const selectedResource = resourceData?._dBuyerDeckResources.filter((card: ResourceCardProps) => card.uuid === selectedCard)[0];
            
            if (document.visibilityState === 'hidden' && trackingDataRef.current.uuid && trackingDataRef.current.startedAt && selectedResource && selectedResource.content.extension !== "PDF" && selectedResource.type !== "VIDEO") {
                
                trackResource({
                    variables: {
                        input: {
                            resourceUuid: trackingDataRef.current.uuid,
                            startedAt: trackingDataRef.current.startedAt,
                            durationSpentInSecs: Math.ceil((Date.now() - trackingDataRef.current.startedAt) / 1000),
                        }
                    }
                });
            } else if (document.visibilityState === 'visible' && selectedResource && selectedResource.content.extension !== "PDF" && selectedResource.type !== "VIDEO") {
                trackingDataRef.current = {
                    uuid: trackingDataRef.current.uuid,
                    startedAt: Date.now(),
                    durationSpentInSecs: null
                };
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('beforeunload', handleVisibilityChange);

        return (() => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('beforeunload', handleVisibilityChange);
        });

    }, [selectedCard]);

    // API hitting when user changes the resources

    useEffect(() => {    
        let firstRun = true;
        observerRef.current = new IntersectionObserver((entries) => {
            if (firstRun) {
                firstRun = false;
                return;
            }
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const uuid = entry.target.getAttribute('data-uuid');
                    setSelectedCard(uuid);
                }
            });
        }, {
            threshold: 1.0
        });
    
        const observer = observerRef.current;
    
        const handleObserver = () => {
            if (observer) {
                resRef.current.forEach((ref) => {
                    if (ref) {
                        observer.observe(ref);
                    }
                });
            }
        };
    
        handleObserver();
    
        return () => {
            if (observer) {
                observer.disconnect();
                observerRef.current = null;
            }
        };
    }, [selectedCard, resourceData]);

    // When is user is inactive for 30 minute API hits

    useEffect(() => {
        const handleMouseMove = () => {
            const selectedResource = resourceData?._dBuyerDeckResources.filter((card: ResourceCardProps) => card.uuid === selectedCard)[0];
            if (selectedResource && selectedResource.content.extension !== "PDF" && selectedResource.type !== "VIDEO") {
                lastActivityRef.current = Date.now();
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                startInactivityTimer();
            }
        };

        const startInactivityTimer = () => {
            timeoutRef.current = setInterval(() => {
                const currentTime = Date.now();
                const elapsedTime = (currentTime - lastActivityRef.current) / 1000;
                if (elapsedTime >= 1800) {
                    trackResource({
                        variables: {
                            input: {
                                resourceUuid: selectedCard,
                                startedAt: lastActivityRef.current,
                                durationSpentInSecs: Math.ceil(elapsedTime - 1800),
                            }
                        }
                    });
                    lastActivityRef.current = currentTime;
                }
            }, 60000);
        };

        window.addEventListener('mousemove', handleMouseMove);
        startInactivityTimer();
    
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="j-deck-resources-preview-scroll-snap cm-height100 j-deck-content cm-width100">
            {resourceData?._dBuyerDeckResources.map((item: any, index: number) => (
                <a
                    key         =   {item.uuid}
                    ref         =   {(el) => resRef.current[index] = el}
                    className   =   {`${selectedCard === item.uuid ? "active" : ""}`}
                    data-uuid   =   {item.uuid}
                >
                    <DeckResource index={index} />
                </a>
            ))}
        </div>
    );
};

export default DeckResourceContentPreview;
