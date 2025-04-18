import { gql } from "@apollo/client";

export const UPDATE_COMPONENT_PROFILE_IMG =   gql`
    mutation UpdateComponentProfile($componentUuid: String!, $widgetUuid: String!, $profileImage: Upload){
        updateComponentProfile(componentUuid: $componentUuid, widgetUuid: $widgetUuid, profileImage : $profileImage)
    }
`;


export const UPDATE_WIDGET = gql`
    mutation UpdateWidget($sectionUuid: String!, $widgetUuid: String!, $input: WidgetInput!){
        updateWidget(sectionUuid: $sectionUuid, widgetUuid: $widgetUuid, input: $input)
    }
`;

export const DELETE_COMPONENT = gql`
    mutation DeleteComponent($componentUuid: String!, $widgetUuid: String!){
        deleteComponent(componentUuid: $componentUuid, widgetUuid: $widgetUuid)
    }
`;

export const ADD_COMPONENT = gql`
    mutation AddComponent($widgetUuid: String!, $content: Map, $order: Int){
        addComponent(widgetUuid: $widgetUuid, content: $content, order: $order){
            uuid
        }
    }
`;

export const UPDATE_RESOURCE_COMPONENT_V2 = gql`
    mutation UpdateResourceComponentV2($componentUuid: String!, $widgetUuid: String!, $resourceInput: ResourceInput!, $isTemplate: Boolean){
        updateResourceComponentV2(componentUuid: $componentUuid, widgetUuid: $widgetUuid, resourceInput: $resourceInput, isTemplate: $isTemplate)
    }
`;

export const CLONE_WIDGET = gql`
    mutation CloneWidget($sectionUuid: String!, $widgetUuid: String!, $input: WidgetInput){
        cloneWidget(sectionUuid: $sectionUuid, widgetUuid: $widgetUuid, input: $input){
            uuid
        }
    }
`;
