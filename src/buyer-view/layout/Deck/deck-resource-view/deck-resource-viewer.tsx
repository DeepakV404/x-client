import { useContext, useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";

import ReactPlayer from "react-player";

import { D_TrackDeckResource } from "../API/deck-mutation";
import { DeckValuesContext } from "..";

const DeckVideoPlayer = (props: {resource: any}) => {

    const { resource }          =   props;

    const { selectedCard }      =   useContext(DeckValuesContext)

    const playerRef             =   useRef<ReactPlayer | null>(null);
    const playIntervalRef       =   useRef<NodeJS.Timeout | null>(null);
    // const videoHeatMapArray     =   useRef<number[]>([])
    const hasStartedPlaying     =   useRef(false)
    const videoSecRef           =   useRef(0)
    const hasTrackedFirstPlay   =   useRef(false);
    
    const videoUrl              =   resource.content.url;

    const [totalPlayTime, setTotalPlayTime]     =   useState<number>(0);

    // const handleTotalDuration = (duration: number) => {
    //     const ceilDuration = Math.ceil(duration);  
    //     videoHeatMapArray.current = Array(ceilDuration).fill(0);
    // };

    // const handleVideoOnPlaying = (e: any) => {
    //     const videoSecRef = Math.max(0, Math.floor(e.playedSeconds));              
    //     if (videoSecRef < videoHeatMapArray.current.length && hasStartedPlaying.current) {
    //         videoHeatMapArray.current[videoSecRef] += 1;
    //     }
    // }

    const handleOnPlay = () => {        
        hasStartedPlaying.current = true
        startTracking();

        if (!hasTrackedFirstPlay.current) {
            hasTrackedFirstPlay.current = true;
            trackResource({
                variables: {
                    input: {
                        resourceUuid: resource.uuid,
                        isViewed: true,
                    },
                },
            });
        }
    }

    const handleOnPause = () => {
        hasStartedPlaying.current = false;
        stopTracking();
    };

    const handleOnSeek = (e: any) => {
        videoSecRef.current =  Math.ceil(e)
    }

    const [trackResource]   =   useMutation(D_TrackDeckResource, {
        fetchPolicy: "network-only",
    });

    const startTracking = () => {
        if (!playIntervalRef.current) {
            playIntervalRef.current = setInterval(() => {
                setTotalPlayTime((prevSeconds) => prevSeconds + 1);
            }, 1000);
        }
    };

    const stopTracking = () => {
        if (playIntervalRef.current) {
            clearInterval(playIntervalRef.current);
            playIntervalRef.current = null;

            trackResource({
                variables: {
                    input: {
                        resourceUuid        :   resource.uuid,
                        // isViewed            :   true,
                        durationSpentInSecs :   totalPlayTime,
                        // trackInput          :   {
                        //     start           :   1,
                        //     end             :   videoHeatMapArray.current.length - 1,
                        //     data            :   videoHeatMapArray.current
                        // }
                    },
                },
                onCompleted: () => {
                    setTotalPlayTime(0)
                    // videoHeatMapArray.current.fill(0)
                }
            });
        }
    };

    const onEnded = () => {
        stopTracking();
    };

    useEffect(() => {
        return () => {
            if (playerRef.current) {
                const player = playerRef.current.getInternalPlayer();
                if (player && typeof player.pause === "function") {
                    player.pause();
                }
            } 
        }
    }, [selectedCard]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (playerRef.current) {
                    const player = playerRef.current.getInternalPlayer();
                    if (player) {
                        player.pause();
                    }
                }
            }
        };
    
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('beforeunload', stopTracking);
    
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('beforeunload', stopTracking);
        };
    }, []);

    return (
        <ReactPlayer 
            className       =   "j-deck-react-player"
            ref             =   {playerRef}
            style           =   {{display: "flex", alignItems: "center", justifyContent: "center"}}
            controls        =   {true}
            url             =   {videoUrl}
            loop            =   {false}
            // onDuration      =   {handleTotalDuration}
            // onProgress      =   {handleVideoOnPlaying}
            onPlay          =   {handleOnPlay}
            onPause         =   {handleOnPause}
            onSeek          =   {handleOnSeek}
            onEnded         =   {onEnded}
            config          =   {{
                youtube: {
                    playerVars: { autoplay: 0 }
                },
            }}
        />
    )
}

export default DeckVideoPlayer