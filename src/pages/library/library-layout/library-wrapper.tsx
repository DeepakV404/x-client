import { useEffect } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { Breadcrumb, Typography } from 'antd';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { FOLDERS, GET_FOLDER_PATH } from '../api/library-query';

import SomethingWentWrong from '../../../components/error-pages/something-went-wrong';
import Loading from '../../../utils/loading';
import LibraryFolder from './library-folder';
import LibraryFiles from './library-files';

interface OutletContext {
    getFolderName: (folderName: string) => void;
}

const { Text }  =   Typography;

const LibraryWrapper = () => {

    const { folderId }      =   useParams();
    const outletContext     =   useOutletContext() as OutletContext;

    const navigate          =   useNavigate();

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
        if(folderId !== "home" && folderId !== "all-resources" && folderId !== "links"){
            _getFolderPath({
                variables: {
                    folderUuid  :  folderId
                }
            })
        }
    }, [folderId])

    if(loading) return <Loading/>
    if(error || fError ) return <SomethingWentWrong/>

    let path = fData ? fData.getFolderPath.map((_path: any) => (
        {
            "title"     :   _path.title, 
            "key"       :   _path.uuid, 
            "onClick"   :   () => navigate(`/library/${_path.uuid}`)
        })) 
    : []
    let folderName = fData && fData.getFolderPath.length > 0 ? fData.getFolderPath[fData.getFolderPath.length - 1].title : "";
    outletContext.getFolderName(folderName);

    return (
        <>
            {
                fData && fData.getFolderPath.length > 0 && folderId !== "home" && folderId !== "all-resources" && folderId !== "links"?
                    <Breadcrumb
                        className   =   'j-library-breadcrumb cm-margin-bottom20 cm-cursor-pointer'
                        items       =   {[{key: "home", title: "Home", onClick: () => navigate(`/library/home`)}].concat(path)} 
                        itemRender  =   {(route) => {
                            return <Text style={{maxWidth: "200px"}} ellipsis={{tooltip: route.title}} onClick={route.onClick} className={folderId === route.key ? "cm-font-fam500" : ""}>{route.title}</Text>
                        }}
                    />
                : 
                    null
            }
            {data.folders.length > 0 && folderId !== "all-resources" && <LibraryFolder folders={data.folders}/>}
            <LibraryFiles folderId={folderId} totalFoldersCount={data.folders.length}/>
        </>
    )
}

export default LibraryWrapper