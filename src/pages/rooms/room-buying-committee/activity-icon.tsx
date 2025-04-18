
import { Avatar } from "antd";

import { COMMENTED_ACTION_POINT, CREATED_ACTION_POINT, UPDATED_ACTION_POINT_ASSIGNEE, UPDATED_ACTION_POINT_DUE, UPDATED_ACTION_POINT_STATUS } from "../config/activity-config";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";

const ActivityIcon = (props: {activity: any}) => {

    const {activity} = props

    const getIcon = (icon: any) => {
        return (
            <Avatar className={"j-room-activity-icon-avatar cm-flex-center"} size={30} icon={icon} />
        )
    }
     
    const getAvatarStyle = (type: string) => {
        switch (type) {
            case "success":
                return ({
                    backgroundColor: "#D0E7D2", 
                    color: "#317838", 
                    border: "1px solid #D0E7D2"
                })
        
            case "comment":
                return ({
                    backgroundColor: "#DAF5FF",
                    border: "1px solid #DAF5FF",
                    color: "#4682A9"
                })
        }
    }
    const getColorIcon = (icon: any, type: string) => {
        return (
            <Avatar className={"j-room-activity-icon-avatar cm-flex-center"} size={30} icon={icon} style={getAvatarStyle(type)}/>
        )
    }

    const DefaultIcon = () => {
        return <MaterialSymbolsRounded font="radio_button_checked" size="12" color="#737373"/>
    }

    switch(activity.type)
    {    

        case COMMENTED_ACTION_POINT:   
            return getColorIcon(<MaterialSymbolsRounded font="comment" size="17"/>, "comment")

        case UPDATED_ACTION_POINT_STATUS:
            if(activity.activityData.updatedStatus === "COMPLETED"){
                return getColorIcon(<MaterialSymbolsRounded font="check_circle" size="17"/>, "success")
            }else{
                return <DefaultIcon />
            }
        
        case UPDATED_ACTION_POINT_DUE:
            return getIcon(<MaterialSymbolsRounded font="edit_calendar" size="17"/>)
        
        case UPDATED_ACTION_POINT_ASSIGNEE:
            return getIcon(<MaterialSymbolsRounded font="manage_accounts" size="17"/>)
        
        case CREATED_ACTION_POINT:
            return getIcon(<MaterialSymbolsRounded font="add_task" size="17"/>) 

        default: return <DefaultIcon/>
    }
    
}

export default ActivityIcon;