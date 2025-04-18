import { useContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Button, Dropdown, List, Typography } from 'antd';

import { PermissionCheckers } from '../../../../config/role-permission';
import { ERROR_CONFIG } from '../../../../config/error-config';
import { CommonUtil } from '../../../../utils/common-util';
import { SettingsAgent } from '../../api/settings-agent';
import { CATEGORIES } from '../../api/settings-query';
import { GlobalContext } from '../../../../globals';

import DeleteConfirmation from '../../../../components/confirmation/delete-confirmation';
import SomethingWentWrong from '../../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import Loading from '../../../../utils/loading';
import OptionsAddModal from '../options-add-modal';
import OptionsEditModal from '../options-edit-modal';

const { Text }  =   Typography;

const UsecaseCategoriesList = () => {

    const { $user } =   useContext(GlobalContext);

    const [showModal, setShowModal]       =   useState<any>({
        visible                 :   false,
        type                    :   {name: "", op: ""},
        currentResourceCategory :   null 
    });

    const [deleteState, setDeleteState]     =   useState({
        visibility      :   false,
        currentCategory :   null 
    });

    const { data, loading, error }          =   useQuery(CATEGORIES, {
        fetchPolicy: "network-only"
    });

    if(error) return <SomethingWentWrong/>

    const getMenuItems = (category: any) => {
        
        return ([
            PermissionCheckers.__checkUsecaseCategoryPermisson($user.role).update ?
            {
                key     :   'edit',
                icon    :   <MaterialSymbolsRounded font="edit" size="16"/>,
                label   :   (
                    <span>Edit</span>
                ),
                onClick :   () => {
                    setShowModal({visible: true, type: {name: "Usecase", op: "edit"}, currentResourceCategory : category })
                    
                },
            }: null,
            PermissionCheckers.__checkUsecaseCategoryPermisson($user.role).delete ?
            {
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
        SettingsAgent.deleteCategory({
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

    return (
        <>
            <div className="cm-height100">
                <div className="j-setting-header cm-flex-space-between-center" style={{height: "53px"}}>
                    <div className="cm-font-size16 cm-font-fam500">Usecase Categories</div> 
                    {
                        PermissionCheckers.__checkUsecaseCategoryPermisson($user.role).create ?
                            <Button type='primary' className="j-setting-footer-btn cm-flex-center" onClick={() => setShowModal({visible: true, type: {name: "Usecase", op: "add", currentResourceCategory: null}})}>
                                Add 
                            </Button>
                        :
                            null
                    }
                </div>
                <List
                    bordered    =   {false}
                    style       =   {{height: "calc(100% - 55px)",  overflow: "auto"}}
                >
                    {
                        data 
                        ? 
                            (
                                data.usecaseCategories.length > 0 ?
                                    data.usecaseCategories.map((item: { _id: String, uuid: String, name: String }) => (
                                        <List.Item className='j-category-list-item cm-cursor-pointer' style={{padding: "15px 20px"}}>
                                            <div className='cm-width100 cm-flex-space-between'>
                                                <Text style={{maxWidth: "100%"}} ellipsis={{tooltip: item.name}}>{item.name}</Text>
                                                {
                                                    PermissionCheckers.__checkUsecaseCategoryPermisson($user.role).update || PermissionCheckers.__checkUsecaseCategoryPermisson($user.role).delete ?
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
                                    <div className='cm-empty-text cm-flex-center' style={{height: "calc(100vh - 160px)"}}>No usecase categories found</div>
                            )
                        :   
                            (loading ? <div style={{height: "calc(100vh - 160px)"}}><Loading/></div> : null) 
                    }
                </List>
            </div>
            <OptionsAddModal
                isOpen          =   {showModal.visible && showModal.type.op === "add"}
                onClose         =   {() => setShowModal({visible: false, type: {name: "", op: "", currentResourceCategory: null}})}
                type            =   {showModal.type}
            />
            <OptionsEditModal 
                isOpen                  =   {showModal.visible && showModal.type.op === "edit"}
                onClose                 =   {() => setShowModal({visible: false, type: {name: "", op: "", currentCategory: null}})}
                type                    =   {showModal.type}
                currentResourceCategory =   {showModal.currentResourceCategory}
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

export default UsecaseCategoriesList