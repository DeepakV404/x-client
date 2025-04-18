import { useContext, useState } from 'react';
import { Button, Divider, Space } from 'antd';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { RenderThumbnailItemProps, thumbnailPlugin } from '@react-pdf-viewer/thumbnail';

import { RoomsAgent } from '../../api/rooms-agent';
import { ToolbarSlot } from '@react-pdf-viewer/default-layout';
import { LibraryModalContext, LibraryModalView } from './library-modal';
import { RenderZoomInProps, RenderZoomOutProps } from '@react-pdf-viewer/zoom';
import { DocumentLoadEvent, SpecialZoomLevel, Viewer } from "@react-pdf-viewer/core";

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import Loading from '../../../../utils/loading';

const SelectPage = () => {

    const { setLibraryView, libraryView, setIsDrawerOpen, pdfCustomPageSelection, selectedResources, setSelectedResources }  =   useContext<any>(LibraryModalContext);
    
    const [selectedPages, setSelectedPages]     =   useState<boolean[]>([]);
    const [selectAll, setSelectAll]             =   useState(true)
    const [loading, setLoading]                 =   useState(false)

    let contentUrl = libraryView?.selectedResource?.content?.url

    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;

    const thumbnailPluginInstance       =   thumbnailPlugin({
        thumbnailWidth: 50,
        renderSpinner: () => {
            return <div style={{minHeight: "200px"}} className='cm-flex-center'><Loading/></div>
        },
    });

    const { Thumbnails }                =   thumbnailPluginInstance;
    
    const handleGoBack = () => {
        setLibraryView({
            view                :   LibraryModalView.LIBRARY_PAGE,
        })
    }

    const handleChoosePage = (e: React.ChangeEvent<HTMLInputElement>, pageIndex: number) => {
        const isSelected = e.target.checked;
        selectedPages[pageIndex] = isSelected;
        setSelectedPages([...selectedPages]);
    };

    const handleDocumentLoad = (e: DocumentLoadEvent) => {
        const selectedItem = selectedResources.find((item: any) => item.uuid === libraryView.selectedResource.uuid);
        if (selectedItem?.pages && selectedItem.pages.length) {
            const newSelectedPages = Array(e.doc.numPages).fill(false);
            selectedItem.pages.forEach((page: number) => {
                const pageIndex = page - 1;                
                if (pageIndex >= 0 && pageIndex < newSelectedPages.length) {
                    newSelectedPages[pageIndex] = true;
                }
            });
            setSelectedPages(newSelectedPages);
        } else {
            setSelectedPages(Array(e.doc.numPages).fill(true));
        }
    };
    
    const handleToggleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setSelectedPages(Array(selectedPages.length).fill(newSelectAll));
    };

    const handleAddPages = () => {
        const selectedPagesArray = selectedPages.map((selected, idx) => (selected ? idx + 1 : false)).filter(Number);
        setSelectedResources((prevResources: any) => {
            const resourceIndex = prevResources.findIndex((resource: any) => resource.uuid === libraryView.selectedResource.uuid);
            if (resourceIndex !== -1) {
                const updatedResources = [...prevResources];
                updatedResources[resourceIndex] = {
                    ...updatedResources[resourceIndex],
                    pages: selectedPagesArray, 
                };
                return updatedResources;
            }
            return prevResources; 
        });
        if (pdfCustomPageSelection.module === "deck") {        
            setLibraryView({
                view                :   LibraryModalView.LIBRARY_PAGE,
            })
        } else {
            setLibraryView({
                view                :   LibraryModalView.LIBRARY_PAGE,
            })
            setLoading(true)
            RoomsAgent.updateResourceComponentByPages({
                variables: {
                    widgetUuid      : pdfCustomPageSelection.widget.uuid,
                    componentUuid   : pdfCustomPageSelection.widget.components[0].uuid,
                    resourceUuid    : libraryView.selectedResource.uuid,
                    pages           : selectedPagesArray
                },
                onCompletion: () => {
                    setIsDrawerOpen(false)
                    setLoading(false)
                },
                errorCallBack: () => {}
            })
        }
    }

    const renderThumbnailItem = (props: RenderThumbnailItemProps) => (
        <Space 
            className   =   'cm-width100 cm-padding10 cm-flex-space-between cm-cursor-pointer j-rpv-page-list' 
            key         =   {props.pageIndex}
            onClick     =   {() => props.onJumpToPage()}
            style       =   {{
                backgroundColor: props.pageIndex === props.currentPage ? '#cce6ff33' : '#fff',
                borderBottom: (props.numPages === (props.pageIndex + 1)) ? "none" : "1px solid #ECF1F6",
                borderRadius: props.numPages === (props.pageIndex + 1) ? "6px" : "0px"
            }}
        >
            <Space size={10}>
                <div className='j-select-page-thumbail-wrapper'>
                    {props.renderPageThumbnail}
                </div>
                <div>Page {props.pageIndex + 1}</div>
            </Space>
            <input
                type        =   "checkbox"
                className   =   'cm-cursor-pointer'
                style       =   {{width: "17px", height: "17px"}}
                checked     =   {selectedPages[props.pageIndex] || false}
                onChange    =   {(e) => handleChoosePage(e, props.pageIndex)}
            />
        </Space>
    );

    const isAddResourceDisabled = () => {
        if (loading) return true;
        const allPagesSelected  = selectedPages.every(page => page);
        const noPagesSelected   = selectedPages.every(page => !page);
        return allPagesSelected || noPagesSelected;
    };

    return (
        <div className='j-select-page-layout cm-height100'>
            <div className='cm-flex j-select-page-header cm-padding-inline15 cm-background-white'>
                <Space size={12} className='cm-flex-align-center'>
                    <MaterialSymbolsRounded className='cm-cursor-pointer' font='arrow_back'  onClick={() => handleGoBack()}/>
                    <div className='cm-font-size16 cm-font-fam500 cm-font-opacity-black-85 cm-letter-spacing0'>{libraryView?.selectedResource?.title}</div>
                    <div
                        style={{
                            left: '50%',
                            position: 'absolute',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1,
                        }}
                    >
                        <Toolbar>
                            {(props: ToolbarSlot) => {
                                const { CurrentPageInput, NumberOfPages, Zoom, ZoomIn, ZoomOut } = props;
                                return (
                                    <div className='cm-flex-align-center' style={{height: "30px"}}>
                                        <div className='cm-flex-align-center' style={{fontSize: "13px", marginRight: "5px"}}>
                                            <div style={{height: "30px", width: "30px", borderRadius: "4px", marginRight: "10px", textAlign: "center"}}><CurrentPageInput /></div> / <NumberOfPages />
                                        </div>
                                        <Divider type='vertical' style={{height: "20px"}}/>
                                        <ZoomOut>
                                            {
                                                (props: RenderZoomOutProps) => (
                                                    <div onClick={props.onClick} className='cm-cursor-pointer cm-user-select-none'>
                                                        <MaterialSymbolsRounded font='remove'/>
                                                    </div>
                                                )
                                            }
                                        </ZoomOut>
                                        <Zoom/>
                                        <ZoomIn>
                                            {
                                                (props: RenderZoomInProps) => (
                                                    <div onClick={props.onClick} className='cm-cursor-pointer cm-user-select-none'>
                                                        <MaterialSymbolsRounded font='add'/>
                                                    </div>
                                                )
                                            }
                                        </ZoomIn>
                                    </div>
                                );
                            }}
                        </Toolbar>
                    </div>
                </Space>
            </div>
            <div className='cm-flex' style={{height: "calc(100% - 50px"}}>
                {/* Previewer */}
                <div className='j-select-page-preview-layout'>
                    {
                        contentUrl ?
                            <Viewer 
                                fileUrl         =   {contentUrl} 
                                onDocumentLoad  =   {handleDocumentLoad}
                                defaultScale    =   {SpecialZoomLevel.PageWidth} 
                                plugins         =   {[thumbnailPluginInstance, toolbarPluginInstance]}
                            /> 
                        :
                            null
                    }
                </div>
                {/* Thumbnail list */}
                <div className='j-select-page-selector-layout cm-background-white cm-padding15'>
                    <Space className='cm-flex-space-between'>
                        <div className='cm-font-fam500 cm-letter-spacing0' style={{lineHeight: "22px"}}>Select Pages</div>
                        <div className='cm-flex-justify-end'>
                            <Button type='link' className='cm-float-right' onClick={handleToggleSelectAll}>{`${selectAll ? "Unselect" : "Select"}`} All</Button>
                        </div>
                    </Space>
                    <div className='cm-letter-spacing0 j-select-page-selected-list cm-font-size13 cm-margin-bottom10' style={{lineHeight: "22px", minHeight: '40px', maxHeight: "40px", overflow: "auto"}}>
                        Selected pages:{' '}
                        {selectedPages?.map((selected, idx) => (selected ? idx + 1 : false)).filter(Number).join(', ')}
                    </div>
                    <div className='j-select-pages-thumb-list-wrapper' style={{minHeight: "auto", maxHeight: "calc(100% - 165px)", overflow: "auto", marginBottom: "15px"}}>
                        <Thumbnails renderThumbnailItem={renderThumbnailItem} />
                    </div>
                    <Button size='large' block type='primary' onClick={handleAddPages} disabled={isAddResourceDisabled()}>
                        Add Resource
                        {
                            loading && <Loading color="#fff"/>
                        }
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default SelectPage