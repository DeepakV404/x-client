export const ROOM     =     "ROOM"
export const LIBRARY  =     "LIBRARY"

export const ROOM_RESOURCE_SEGREGATION: Record<string, {
    key              :   any;
    displayName      :   string;
}>  =   {
    [LIBRARY]       :    {
        key               :   LIBRARY,
        displayName       :   "From Library"
    },
    [ROOM]       :    {
        key               :   ROOM,
        displayName       :   "From this Room"
    }
}