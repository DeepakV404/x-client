import { FC, createContext, useState } from "react";
import { Modal } from "antd";

import SelectPage from "./select-page";
import LibrarySelect from ".";

interface LibraryModalProps
{
    isOpen                  :   boolean;
    onClose                 :   () => void;
    getSelectedResourceId   :   (resourceId: string | any[], isAddToRoomChecked?: boolean) => void;
    initialFilter           :   string[];
    multipleResource?       :   boolean;
    pdfCustomPageSelection? :   object
    module?                 :   string;
    setIsDrawerOpen?        :   any
    resourceViewMode?        :   string
}

export const LibraryModalContext: any = createContext(null);

export enum LibraryModalView {
    LIBRARY_PAGE    =   'LIBRARY_PAGE',
    SELECT_PAGE     =   'SELECT_PAGE'
}

interface LibraryViewProps{
    view                :   LibraryModalView,
    selectedResource    :   any
}
  
const LibraryModal: FC<LibraryModalProps> = (props) => {

    const { isOpen, onClose, getSelectedResourceId, multipleResource, module, pdfCustomPageSelection, setIsDrawerOpen, resourceViewMode }   =   props;

    const [selectedResources, setSelectedResources]         =   useState<any[]>([]);
    const [resourceView, setResourceView]                   =   useState(resourceViewMode ?? "grid_view")
    const [selectedRowKeys, setSelectedRowKeys]             =   useState<any[]>([])  

    const [libraryView, setLibraryView]   =   useState<LibraryViewProps>({
        view                :   LibraryModalView.LIBRARY_PAGE,
        selectedResource    :   null
    });

    const handleClose = () => {
        setLibraryView({
            view                :   LibraryModalView.LIBRARY_PAGE,
            selectedResource    :   null
        });        
        setSelectedResources([]); 
        setSelectedRowKeys([]);
    };

    let libraryModalContext = {
        isOpen,
        onClose,
        module,
        libraryView,
        setLibraryView, 
        resourceViewMode        :   resourceViewMode || "dual_view",  
        onAddResource           :   getSelectedResourceId,
        addMultipleResource     :   multipleResource,
        pdfCustomPageSelection  :   pdfCustomPageSelection,
        selectedResources       :   selectedResources,    
        setSelectedResources    :   setSelectedResources,
        resourceView            :   resourceView,
        setResourceView         :   setResourceView,
        selectedRowKeys         :   selectedRowKeys,
        setSelectedRowKeys      :   setSelectedRowKeys,
        setIsDrawerOpen         :   setIsDrawerOpen
    }

    return(
        <Modal 
            centered
            className       =   {`j-library-modal cm-full-screen-modal ${libraryView.view === LibraryModalView.SELECT_PAGE ? "j-select-page-modal" : ""}`}
            open            =   {isOpen} 
            onCancel        =   {onClose}             
            closable        =   {libraryView.view === LibraryModalView.LIBRARY_PAGE}
            footer          =   {null}
            afterClose      =   {handleClose}
            destroyOnClose
        >
            <LibraryModalContext.Provider
                value={{
                    ...libraryModalContext
                }}
            >
                {
                    libraryView.view == LibraryModalView.LIBRARY_PAGE ? 
                        <LibrarySelect/>
                    :
                        <SelectPage />
                }
            </LibraryModalContext.Provider>
        </Modal>
    );
}

export default LibraryModal