import { gql } from "@apollo/client";

export const CREATE_BLOB_RESOURCE = gql`
    mutation CreateBlobResource($title: String!, $description: String, $categories: [String], $content: Upload!, $thumbnail: Upload, $folderUuid: String){
        createBlobResource(title: $title, description: $description, categories: $categories, content: $content, thumbnail: $thumbnail, folderUuid: $folderUuid){
            uuid
            title
        }
    }
`;

export const CREATE_LINK_RESOURCE = gql`
    mutation CreateLinkResource($title: String, $description: String, $categories: [String], $url: String!, $urlType: String, $thumbnailImage: Upload, $folderUuid: String, $properties: Map){
        createLinkResource(title: $title, description: $description, categories: $categories, url: $url, urlType: $urlType, thumbnailImage: $thumbnailImage, folderUuid: $folderUuid, properties: $properties){
            uuid
            title
        }
    }
`;

export const DELETE_RESOURCE = gql`
    mutation DeleteResource($resourceUuid: String!){
        deleteResource(resourceUuid: $resourceUuid)
    }
`;

export const UPDATE_RESOURCE_INFO = gql`
    mutation UpdateResourceInfo($resourceUuid: String!, $title: String, $thumbnailImage: Upload, $categories: [String], $content: Upload, $url: String, $urlType: String){
        updateResource(resourceUuid: $resourceUuid, title: $title, thumbnailImage: $thumbnailImage, categories: $categories, content: $content, url: $url, urlType: $urlType)
    }  
`;

export const REMOVE_RESOURCE_THUMBNAIL = gql`
    mutation RemoveResourceThumbnail($resourceUuid: String!){
        removeResourceThumbnail(resourceUuid: $resourceUuid)
    }
`;

export const CREATE_FOLDER = gql`
    mutation CreateFolder($title: String!, $parentFolderUuid: String){
        createFolder(title: $title, parentFolderUuid: $parentFolderUuid){
            uuid
            title
            description
            subfoldersCount
            resourcesCount
            createdAt
        }
    }
`;

export const DELETE_FOLDER = gql`
    mutation DeleteFolder($folderUuid: String!){
        deleteFolder(folderUuid: $folderUuid)
    }
`;

export const UPDATE_FOLDER = gql`
    mutation UpdateFolder($folderUuid: String!, $input: FolderInput!){
        updateFolder(folderUuid: $folderUuid, input: $input)
    }
`;

export const MOVE_RESOURCES = gql`
    mutation MoveResource($resourceUuids: [String!]!, $folderUuid: String){
        moveResources(resourceUuids: $resourceUuids, folderUuid: $folderUuid)
    }
`;


// DECK

export const CREATE_DECK = gql`
    mutation CreateDeck($input: CreateDeckInput!){
        createDeck(input: $input){
            uuid
        }
    }
`;

export const ADD_DECK_RESOURCES = gql`
    mutation AddDeckResources($deckUuid: String, $resourceInputs: [ResourceInput!]){
        addDeckResourcesV2(deckUuid: $deckUuid, resourceInputs: $resourceInputs)
    }
`;

export const UPDATE_DECK_RESOURCES = gql`
    mutation UpdateDeckResource($deckUuid: String, $resourceUuid: String!, $isHidden: Boolean!){
        updateDeckResource(deckUuid: $deckUuid, resourceUuid: $resourceUuid, isHidden: $isHidden)
    }
`;

export const DELETE_DECK_RESOURCES = gql`
    mutation DeleteDeckResources($deckUuid: String, $resourceUuids: [String!]){
        deleteDeckResources(deckUuid: $deckUuid, resourceUuids: $resourceUuids)
    }
`;

export const INVITE_TO_DECK = gql`
    mutation inviteToDeck($emailId: String!, $message: String!){
        inviteToDeck(emailId: $emailId, message: $message)
    }
`;

export const UPDATE_DECK = gql`
    mutation UpdateDeck($deckUuid: String!, $input: UpdateDeckInput!){
        updateDeckV2(deckUuid: $deckUuid, input: $input)
    }
`;

export const DELETE_DECK = gql`
    mutation DeleteDeck($deckUuid: String){
        deleteDeck(deckUuid: $deckUuid)
    }
`;

export const ADD_DECK_RESOURCE_BY_PAGES = gql`
    mutation AddDeckResourcesByPages($deckUuid: String, $resourceUuid: String!, $pages: [Int!]!){
        addDeckResourceByPages(deckUuid: $deckUuid, resourceUuid: $resourceUuid, pages: $pages)
    }
`;

export const DECK_RESOURCE_REORDER = gql`
    mutation UpdateDeckResourceOrder($deckUuid: String, $resourceUuid: String!, $order: Int!){
        updateDeckResourceOrder(deckUuid: $deckUuid, resourceUuid: $resourceUuid, order: $order)
    }
`;

export const D_CREATE_TAG = gql`
    mutation D_CreateTag($input: CreateTagInput!){
        _dCreateTag(input: $input)
    }
`;

export const D_CREATE_TAGS = gql`
    mutation D_CreateTags($inputs: [CreateTagInput!]){
        _dCreateTags(inputs: $inputs)
    }
`;

export const D_CREATE_AND_ASSOCIATE_TAG = gql`
    mutation D_CreateAndAssociateTag($deckUuid: String, $input: CreateTagInput!){
        _dCreateAndAssociateTag(deckUuid: $deckUuid, input: $input)
    }
`;

export const D_ASSOCIATE_TAG = gql`
    mutation D_AssociateTag($deckUuid: String, $tagUuid: String!){
        _dAssociateTag(deckUuid: $deckUuid, tagUuid: $tagUuid)
    }
`;

export const D_REMOVE_TAG = gql`
    mutation D_RemoveTag($deckUuid: String, $tagUuid: String!){
        _dRemoveTag(deckUuid: $deckUuid, tagUuid: $tagUuid)
    }
`;

// DECK

export const COMPLETE_BLOB_REQUEST = gql`
    mutation CompleteBlobRequest($uploadId: String!, $contentUuid: String!, $input: [CompletedPartInput!]!){
        completeBlobRequest(uploadId: $uploadId, contentUuid: $contentUuid, input: $input)
    }
`;

export const CREATE_RESOURCE = gql`
    mutation CreateResource($title: String!, $description: String, $categories: [String], $input: BlobResourceInput, $thumbnail: Upload, $folderUuid: String){
        createResource(title: $title, description: $description, categories: $categories, input: $input, thumbnail: $thumbnail, folderUuid: $folderUuid){
            _id
            uuid
            title
        }
    }
`;