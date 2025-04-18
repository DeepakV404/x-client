import { useEffect, useImperativeHandle, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Tree, Typography } from 'antd';

import { FOLDERS } from '../api/library-query';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';

const { DirectoryTree }     =   Tree;
const { Text }              =   Typography;

const updateTreeData = (list, key, children) =>
    list.map((node) => {
        if(node.key === key) {
            return {
                ...node,
                children,
            };
        }
        if(node.children) {
            return {
                ...node,
                children: updateTreeData(node.children, key, children),
            };
        }
        return node;
});

const FolderTree = (props) => {

    const { getSelectedFolder, folderRef }   =   props;

    const navigate      =   useNavigate();
    const {folderId}    =   useParams();

    const [treeData, setTreeData]           =   useState([]);
    const [selectedKey, setSelectedKey]     =   useState("")

    useEffect(() => {
        if(folderId === "home" || folderId === "all-resources"){
            setSelectedKey([])
        }
    }, [folderId])

    const [_getSubFolder, { data, error }]   =   useLazyQuery(FOLDERS, {
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        _getSubFolder()
            .then((folderData) => {
                setTreeData(() => folderData.data.folders.map((_folder) => {return {title: <Text  className='cm-flex' style={{width: "100%"}}  ellipsis={{tooltip: _folder.title}}>{_folder.title}</Text>, key: _folder.uuid, subfoldersCount: _folder.subfoldersCount}}))
            })
    }, [])

    const handleNodeClick = (_, node) => {
        if(getSelectedFolder){
            setSelectedKey(node.key)
            getSelectedFolder(node.key, setSelectedKey)
        }else{
            setSelectedKey(node.key)
            navigate(`/library/${node.key}`);
        }
    };

    const onLoadData = ({ key, children, subfoldersCount }) =>
        new Promise((resolve) => {
            if (children) {
                resolve();
                return;
            }
            if(subfoldersCount > 0){
                _getSubFolder({
                    variables: {
                        folderUuid: key
                    }
                }).then((folderData) => {
                    setTreeData((origin) =>
                        updateTreeData(origin, key, folderData.data.folders.map((_folder) => {return {title: <Text  className='cm-flex' style={{width: "100%"}}  ellipsis={{tooltip: _folder.title}}>{_folder.title}</Text>, key: _folder.uuid, subfoldersCount: _folder.subfoldersCount}})),
                    )
                    resolve()
                })
            }else{
                resolve()
            }
    });

    useImperativeHandle(folderRef, () => ({
        resetSelectedKey: () => setSelectedKey("")
    }))

    return(
        <DirectoryTree 
            rootClassName       =   'j-folder-node'
            selectedKeys        =   {selectedKey ? [selectedKey] : []}
            style               =   {{userSelect: "none"}}
            expandAction        =   {"doubleClick"}
            loadData            =   {onLoadData} 
            treeData            =   {treeData}
            icon                =   {(node) => node.expanded ? <MaterialSymbolsRounded font="folder_open" filled size="22" className="cm-secondary-text"/> : <MaterialSymbolsRounded font="folder" filled size="22" className="cm-secondary-text"/>}
            onClick             =   {handleNodeClick}
            switcherIcon        =   {(node) => node.data.subfoldersCount > 0 ? (node.expanded ? <MaterialSymbolsRounded font='arrow_drop_down' size='22'/> : <MaterialSymbolsRounded font="arrow_right" size='22'/>) : <MaterialSymbolsRounded font="arrow_right" size='22'/>}
        />
    )
};
export default FolderTree;