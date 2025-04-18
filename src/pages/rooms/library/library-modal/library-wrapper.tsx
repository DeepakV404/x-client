import { useContext, useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { Breadcrumb, Input, Segmented, Space, Typography } from 'antd';

import { FOLDERS, GET_FOLDER_PATH } from '../../../library/api/library-query';

import SomethingWentWrong from '../../../../components/error-pages/something-went-wrong';
import Loading from '../../../../utils/loading';
import LibraryFolder from './library-folder';
import LibraryFiles from './library-files';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import { LibraryModalContext } from './library-modal';

const { Text }  =   Typography;

const LibraryWrapper = (props: {folderId: any, setCurrentPage: any, setIsResourceOpen: any}) => {

    const { folderId, setCurrentPage }       =   props;

    const { resourceView, setResourceView, resourceViewMode }  =   useContext<any>(LibraryModalContext);

    const [search, setSearch]                               =   useState<string>("");

    const { data, loading, error }      =   useQuery(FOLDERS, {
        fetchPolicy: "network-only",
        variables: {
            folderUuid  :   (folderId === "home" || folderId === "all-resources") ? undefined : folderId
        }
    })

    const [_getFolderPath, { data: fData, error: fError }]      =   useLazyQuery(GET_FOLDER_PATH, {
        fetchPolicy: "network-only",
        variables: {
            folderUuid  :  folderId
        }
    })

    useEffect(() => {
        if(folderId !== "home" && folderId !== "all-resources"){
            _getFolderPath({
                variables: {
                    folderUuid  :  folderId
                }
            })
        }
    }, [folderId])

    if(loading) return <Loading/>
    if(error || fError) return <SomethingWentWrong/>

    let path = fData ? fData.getFolderPath.map((_path: any) => (
        {
            "title"     :   _path.title, 
            "key"       :   _path.uuid, 
            "onClick"   :   () => setCurrentPage(_path.uuid)
        })) 
    : []

    return (
        <div className='j-library-modal-wrapper cm-padding20 cm-overflow-auto'>
            <div className='cm-flex-align-center cm-flex-space-between'>
                {
                    fData && fData.getFolderPath.length > 0 && folderId !== "home" && folderId !== "all-resources"?
                        <Breadcrumb
                            className   =   'cm-cursor-pointer'
                            items       =   {[{key: "home", title: "Home", onClick: () => setCurrentPage("home")}].concat(path)} 
                            itemRender  =   {(route) => {
                                return <Text style={{maxWidth: "200px"}} ellipsis={{tooltip: route.title}} onClick={route.onClick} className={folderId === route.key ? "cm-font-fam500" : ""}>{route.title}</Text>
                            }}
                        />
                    : 
                        <div></div>
                }
                <Space size={20}>
                    <Input autoFocus allowClear placeholder="Search" className="j-doc-list-search" suffix={<MaterialSymbolsRounded font="search" size="18"/>} onChange={(e) => setSearch(e.target.value)} style={{width: "400px", height: "35px"}}/>
                    {resourceViewMode === "dual_view" && <Space>
                    <Segmented
                        onChange        =   {(value) => setResourceView(value)}
                        defaultValue    =   {resourceView}
                        options         =   {[
                            {
                                value: 'grid_view',
                                icon: <AppstoreOutlined className={resourceView === "grid_view" ? "cm-active-color" : ""}/>,
                            },
                            {
                                value: 'list_view',
                                icon: <BarsOutlined className={resourceView === "list_view" ? "cm-active-color" : ""}/>,
                            }
                        ]}
                    />
                </Space>}
                </Space>
            </div>
            {data.folders.length > 0 && folderId !== "all-resources" && <LibraryFolder folders={data.folders} onFolderClick={setCurrentPage}/>}
            <LibraryFiles search={search} {...props}/>
        </div>
    )
}

export default LibraryWrapper