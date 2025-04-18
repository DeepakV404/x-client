import { useQuery } from '@apollo/client';

import { ENGAGEMENT_STATUS_SETTINGS } from '../api/settings-query';

import Loading from '../../../utils/loading';
import OverallRoomSettings from '.';

interface SettingsTransformedDataProp
{
    statusBase  :   "DAYS" | "ACTIVITIES_COUNT";
    noOfDays    :   number;
    hotCount    :   number;
    warmCount   :   number;
}

const RoomSettingsTransformer = () => {

    const { data, loading }  =   useQuery(ENGAGEMENT_STATUS_SETTINGS, {
        fetchPolicy: "network-only"
    });

    if(loading) return <Loading/>

    const settingsTransformedData: SettingsTransformedDataProp = {
        statusBase  :   data?.engagementStatusSettings.configurationType,
        noOfDays    :   data?.engagementStatusSettings.noOfDays,
        hotCount    :   data?.engagementStatusSettings.hot,
        warmCount   :   data?.engagementStatusSettings.warm
    }
    
    return (
        <OverallRoomSettings
            settings    =   {settingsTransformedData}
        />
    )
}

export default RoomSettingsTransformer