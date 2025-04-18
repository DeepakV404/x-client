export interface RoomSettingItem {
    type                :   "toggle" | "language" | "button";
    label               :   string;
    description?        :   string;
    valueKey            :   string;
    languageOptions?    :   { label: string; key: string }[];
    serverKey?          :   string;
}

export type RoomSettingsBooleanKeys = "messages" | "actionPointComments" | "discovery" | "inProductNotifications" | "emailNotifications";

export const roomSettingsConfig: RoomSettingItem[] = [
    {
        type        :   "toggle",
        label       :   "Messages",
        description :   "Prevent buyers from adding new messages to this room",
        valueKey    :   "messages",
        serverKey   :   "isMessageEnabled",
    },
    {
        type        :   "toggle",
        label       :   "Action Plan Comments",
        description :   "Stop others from adding comments against action point",
        valueKey    :   "actionPointComments",
        serverKey   :   "isCommentsEnabled",
    },
    {
        type        :   "toggle",
        label       :   "Email Notifications",
        description :   "Enable email notifications for this room",
        valueKey    :   "emailNotifications",
        serverKey   :   "isMailNotificationEnabled",
    },
    {
        type        :   "toggle",
        label       :   "In-Product Notifications",
        description :   "Enable in-product notifications for this room",
        valueKey    :   "inProductNotifications",
        serverKey   :   "isInProdNotificationEnabled",
    },
    {
        type        :   "toggle",
        label       :   "Discovery",
        description :   "Discovery questions will be displayed to contacts",
        valueKey    :   "discovery",
    },
];