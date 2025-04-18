const GetRoomEngagementStatus = (props: {roomStatus: any, tagStyle?: {lineHeight?: string}}) => {

    const { roomStatus, tagStyle }    =   props
    
    switch (roomStatus) {
        case "HOT":
            return (
                <div style={{width: "70px", padding: "1px 6px", whiteSpace: "nowrap", border: "1px solid #FFBB96", background: "#FFF2E8", borderRadius: "4px", color: "#FA541C", fontSize: "12px", lineHeight: tagStyle?.lineHeight ?? "22px"}} className='cm-flex-center'>
                    🔥 Hot
                </div>
            );
        case "WARM":
            return (
                <div className='cm-flex-center' style={{ width: "70px", padding: "1px 6px", whiteSpace: "nowrap", border: "1px solid #FFBB96", background: "#FFFBE6", borderRadius: "4px", color: "#FAAD14", fontSize: "12px", lineHeight: tagStyle?.lineHeight ?? "22px" }}>
                    ⛅ Warm
                </div>
            );
        case "COLD":
            return (
                <div className='cm-flex-center' style={{ width: "70px", padding: "1px 6px", whiteSpace: "nowrap", border: "1px solid #91D5FF", background: "#E6F7FF", borderRadius: "4px", color: "#1890FF", fontSize: "12px", lineHeight: tagStyle?.lineHeight ?? "22px" }}>
                    🧊 Cold
                </div>
            );
        case "NOT_ENGAGED":
            return (
                <div className='cm-flex-center' style={{ width: "fit-content", padding: "1px 6px", whiteSpace: "nowrap", border: "1px solid #FFA39E", background: "#FFF1F0", borderRadius: "4px", color: "#F5222D", fontSize: "12px", lineHeight: tagStyle?.lineHeight ?? "22px" }}>
                    🚫 Not Engaged
                </div>
            );
        default:
            return null;
    }
}

export default GetRoomEngagementStatus;
