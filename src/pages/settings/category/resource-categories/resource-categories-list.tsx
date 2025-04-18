import { useContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Button, Dropdown, List, Typography } from 'antd';
import { GlobalContext } from '../../../../globals';
import { RESOURCE_CATEGORIES } from '../../api/settings-query';
import { PermissionCheckers } from '../../../../config/role-permission';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import { SettingsAgent } from '../../api/settings-agent';
import { CommonUtil } from '../../../../utils/common-util';
import { ERROR_CONFIG } from '../../../../config/error-config';
import SomethingWentWrong from '../../../../components/error-pages/something-went-wrong';
import DeleteConfirmation from '../../../../components/confirmation/delete-confirmation';
import Loading from '../../../../utils/loading';
import OptionsEditModal from '../options-edit-modal';
import OptionsAddModal from '../options-add-modal';

const { Text }  =   Typography;

const ResourceCategoriesList = () => {

    const { $user } =   useContext(GlobalContext);

    const [showResourceCategoryModal, setResourceCategoryModal]     =   useState<any>({
        visible                 :   false,
        type                    :   {name: "", op: ""},
        currentResourceCategory :   ""
    });

    const [deleteState, setDeleteState]     =   useState({
        visibility      :   false,
        currentCategory :   null 
    });

    const { data, loading, error }  =   useQuery(RESOURCE_CATEGORIES, {
        fetchPolicy: "network-only"
    });


    const getMenuItems = (category: any) => {     
           
        return ([
        PermissionCheckers.__checkResourceCategoryPermisson($user.role).update ? 
        {
            key     :   'edit',
            icon    :   <MaterialSymbolsRounded font="edit" size="16"/>,
            label   :   (
                <span>Edit</span>
            ),
            onClick :   () => {
                setResourceCategoryModal({visible: true, type: {name: "Resource", op: "edit"}, currentResourceCategory: category})
            },
        } : null,
        PermissionCheckers.__checkResourceCategoryPermisson($user.role).delete ? {
            key     :   'delete',
            icon    :   <MaterialSymbolsRounded font="delete" size="16"/>,
            label   :   (
                <span>Delete</span>
            ),
            onClick :   () => {
                setDeleteState({
                    visibility: true,
                    currentCategory: category
                })
            },
            danger  :   true
        } : null,
    ])};

    const handleDelete = (category: any) => {
        SettingsAgent.deleteResourceCategory({
            variables: {
                uuid    :  category.uuid 
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Category deleted successfully");
                setDeleteState({visibility: false, currentCategory: null})
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                setDeleteState({visibility: false, currentCategory: null})
            }
        })  
    }

    if(error) return <SomethingWentWrong/>

    return (
        <>
            <div className='cm-height100'>
                <div className="j-setting-header cm-flex-space-between-center" style={{height: "53px"}}>
                    <div className="cm-font-size16 cm-font-fam500">Resource Categories</div> 
                    {
                        PermissionCheckers.__checkResourceCategoryPermisson($user.role).create ?
                            <Button type='primary' className="j-setting-footer-btn cm-flex-center" onClick={() => setResourceCategoryModal({visible: true, type: {name: "Resource", op: "add"},})}>
                                Add 
                            </Button>
                        :
                            null
                    }
                </div>
                <List 
                    bordered    =   {false}
                    style       =   {{height: "calc(100% - 55px)", overflow: "auto"}}
                >
                    {
                        data 
                        ? 
                            data.categories.map((item: { _id: String, uuid: String, name: String }) => (
                                <List.Item className='j-category-list-item cm-cursor-pointer' style={{padding: "15px"}}>
                                    <div className='cm-width100 cm-flex-space-between'>
                                        <Text style={{maxWidth: "100%"}} ellipsis={{tooltip: item.name}}>{item.name}</Text>
                                        {
                                            PermissionCheckers.__checkResourceCategoryPermisson($user.role).update || PermissionCheckers.__checkResourceCategoryPermisson($user.role).delete ?
                                                <Dropdown menu={{items: getMenuItems(item)}} trigger={["click"]} className='show-on-hover-icon' overlayStyle={{minWidth: "150px"}}>    
                                                    <div onClick={(event) => event.stopPropagation()} className="cm-cursor-pointer">
                                                        <MaterialSymbolsRounded font="more_vert" size="22" className='cm-secondary-text'/>
                                                    </div>
                                                </Dropdown>
                                            :
                                                null
                                        }
                                    </div>
                                </List.Item>
                            ))
                        :   
                            (loading ? <div style={{height: "calc(100vh - 160px)"}}><Loading/></div> : null) 
                        
                    }
                </List>
            </div>
            <OptionsAddModal
                isOpen          =   {showResourceCategoryModal.visible && showResourceCategoryModal.type.op === "add"}
                onClose         =   {() => setResourceCategoryModal({visible: false, type: {name: "", op: ""}})}
                type            =   {showResourceCategoryModal.type}
            />
            <OptionsEditModal 
                isOpen                  =   {showResourceCategoryModal.visible && showResourceCategoryModal.type.op === "edit"}
                onClose                 =   {() => setResourceCategoryModal({visible: false, type: {name: "", op: ""}})}
                type                    =   {showResourceCategoryModal.type}
                currentResourceCategory =   {showResourceCategoryModal.currentResourceCategory}
            />
            <DeleteConfirmation 
                isOpen      =   {deleteState.visibility}
                onOk        =   {() => handleDelete(deleteState.currentCategory)}
                onCancel    =   {() => {setDeleteState({visibility: false, currentCategory: null})}}
                header      =   "Delete Category"
                body        =   "Are you sure you want to delete this category? This cannot be undone."
            />
        </>
    )
}

export default ResourceCategoriesList