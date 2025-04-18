import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Tree, Typography } from 'antd';

import { FOLDERS } from '../../../library/api/library-query';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';

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

const LibraryFolderTree = (props) => {

    const { handleOnFolderClick }   =   props;

    const [treeData, setTreeData] = useState([]);

    const [_getSubFolder, { data, error }]   =   useLazyQuery(FOLDERS, {
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        _getSubFolder()
            .then((folderData) => {
                setTreeData(() => folderData.data.folders.map((_folder) => {return {title: <Text  className='cm-flex' style={{width: "100%"}}  ellipsis={{tooltip: _folder.title}}>{_folder.title}</Text>, key: _folder.uuid}}))
            })
    }, [])

    const onLoadData = ({ key, children }) =>
        new Promise((resolve) => {
            if (children) {
                resolve();
                return;
            }
            _getSubFolder({
                variables: {
                    folderUuid: key
                }
            }).then((folderData) => {
                setTreeData((origin) =>
                    updateTreeData(origin, key, folderData.data.folders.map((_folder) => {return {title: <Text  className='cm-flex' style={{width: "100%"}}  ellipsis={{tooltip: _folder.title}}>{_folder.title}</Text>, key: _folder.uuid}})),
                )
                resolve()
            })
    });

    return(
        <DirectoryTree 
            rootClassName       =   'j-folder-node'
            style               =   {{userSelect: "none"}}
            expandAction        =   {"doubleClick"}
            loadData            =   {onLoadData} 
            treeData            =   {treeData}
            icon                =   {(node) =>  node.expanded ? <MaterialSymbolsRounded font="folder_open" filled size="22" className="cm-secondary-text"/> : <MaterialSymbolsRounded font="folder" filled size="22" className="cm-secondary-text"/>}
            onClick             =   {(_, node) => handleOnFolderClick(node.key)}
        />
    )
};
export default LibraryFolderTree;