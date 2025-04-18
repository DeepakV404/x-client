import { Button, Checkbox, Dropdown, Form, MenuProps, Space, Typography } from 'antd';
import { FC, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ALL, RESOURCE_TYPE_CONFIG } from '../../library/config/resource-type-config';
import { ADD_RESOURCE_CONFIG } from '../../library/config/add-resource-config';
import { AccountsAgent } from '../../accounts/api/accounts-agent';
import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';
import { GlobalContext } from '../../../globals';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import ResourceModal from '../library/resource-form/resource-modal';
import LibraryModal from '../library/library-modal/library-modal';

const { useForm }   =   Form;
const {Text}        =   Typography

interface ResourceFilterProps
{
    setFilter       :   (arg0: any) => void;
    hideAdd?        :   boolean;
}

const ResourceFilter: FC<ResourceFilterProps> = (props) => {

    const { setFilter, hideAdd }     =   props;

    const params            =   useParams();
    const [form]            =   useForm();

    const { $categories, $dictionary }   =   useContext(GlobalContext);

    
    const [showLibraryModal, setShowLibraryModal]   =   useState(false);
    // const [editView, setEditView]                   =   useState(false);
    const [isModalOpen, setIsModalOpen]             =   useState({
        isOpen          :   false,
        type            :   "",
        key             :   "",
        displayname     :   "",
        domain          :   "",
        imageIcon       :   ""
        
    });

    const onFinish = () => {
        let filter: { [key: string]: any } = {}; 

        Object.keys(form.getFieldsValue()).map((_filterItem: any) => {
            _filterItem !== "sortBy" && _filterItem !== "title" && (filter[_filterItem] = form.getFieldsValue()[_filterItem])
        })
        setFilter(filter)
    }

    // const handleEnter = (event: any) => {
    //     if (event.keyCode === 13) {
    //         event.preventDefault();
    //         handleTitleSave()
    //     }
    // }

    // const handleInputBlur = () => {
    //     form.submit()
    // }

    // const { data }  =   useQuery(R_SECTIONS, {
    //     variables: {
    //         roomUuid: params.roomId,
    //         filter  : {
    //             type : "RESOURCES"
    //         }
    //     },
    //     fetchPolicy: "network-only"
    // })

    // const handleTitleSave = () => {
    //     RoomsAgent.updateSection({
    //         variables: {
    //             sectionUuid: data._rSections[0].uuid,
    //             input: {
    //                 title: form.getFieldsValue().title
    //             }
    //         },
    //         onCompletion: () => {
    //             setEditView(false);
    //             CommonUtil.__showSuccess("Title updated successfully")
    //         },
    //         errorCallBack: (error:any) => {
    //             CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
    //         }
    //     })
    //     setEditView(false)
    // }

    const items: MenuProps['items'] = [
        {
            "key"       :   "add_from_resource",
            "title"     :   `Select from ${$dictionary.library.title}`,
            "label"     :   
                <Space style={{minWidth: "280px"}}>
                    <div className='j-add-res-icon-wrap cm-flex-center'>
                        <MaterialSymbolsRounded font={"home_storage"} size='25'/>
                    </div>
                    <Space direction='vertical' size={0}>
                        <div className='cm-font-fam500'>Select from {$dictionary.library.title}</div>
                        <div className='cm-light-text cm-font-size12'>Add a resource from the {$dictionary.library.title}</div>                        
                    </Space>
                </Space>,
            "onClick"   :   (_resource: any) => {
                setShowLibraryModal(true)
            }
        } 
    ];  

    Object.values(ADD_RESOURCE_CONFIG).map((_addResourceType) => {
        let option = {
            "key"       :   _addResourceType.key,
            "title"     :   _addResourceType.view,
            "label"     :   
                <Space style={{minWidth: "280px"}}>
                    <div className='j-add-res-icon-wrap cm-flex-center'>
                        {
                            _addResourceType.imageIcon ?
                                <MaterialSymbolsRounded font={_addResourceType.imageIcon} size='25'/>
                            :
                                <img src={_addResourceType.imageFile} style={{width: "25px", height: "25px"}}/>
                        }
                    </div>
                    <Space direction='vertical' size={0}>
                        <div className='cm-font-fam500'>{_addResourceType.displayName}</div>
                        <div className='cm-light-text cm-font-size12'>{_addResourceType.description}</div>                        
                    </Space>
                </Space>,
            "onClick"   :   (_resource: any) => {
                setIsModalOpen({
                    isOpen          :   true,
                    type            :   _resource.item.props.title,
                    key             :   _addResourceType.key,
                    displayname     :   _addResourceType.displayName,
                    domain          :   _addResourceType.domain ?? "",
                    imageIcon       :   _addResourceType.imageIcon ?? ""
                })
            }
        }  
        items.push(option)
    })

    const handleSelectResource = (resource: any) => {
        AccountsAgent.updateResources({
            variables: {
                roomUuid: params.roomId, 
                resourcesUuid: [resource.uuid], 
                action: "ADD"
            },
            onCompletion: () => {
                setShowLibraryModal(false)
                CommonUtil.__showSuccess("Resource added successfully");
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const filteredResourceTypes = Object.values(RESOURCE_TYPE_CONFIG).filter((type: any) => type.key !== ALL);

    return (
        <div className='cm-height100'>
            {
                !hideAdd &&
                    <Dropdown menu={{items}} trigger={["click"]}>
                        <Button className="j-add-resource cm-flex-center" size="large" icon={<MaterialSymbolsRounded font="add" size="22"/>}>
                            <Space>
                                <div className="cm-font-size14">Add Resource</div>
                                <MaterialSymbolsRounded font='expand_more' size="18"/>
                            </Space>
                        </Button>
                    </Dropdown>
            }

            {/* <Space className='cm-flex-space-between cm-padding-inline15' style={{height: "50px", borderBottom: "1px solid #f2f2f2"}}>
                <div className='cm-flex-align-center'>
                    {
                        RoomEditPermission ?
                            (editView ?
                                <Form form={form} className="cm-form cm-margin-left5 cm-width100 cm-flex-align-center" onFinish={onFinish}>
                                    <>
                                        <Form.Item rules={[{required:true, whitespace: true}]} name={"title"} noStyle initialValue={data?._rSections[0]?.title}>
                                            <Input style={{width: "150px"}} maxLength={Length_Input} autoFocus className="cm-font-fam500 cm-font-size16 cm-input-border-style"  placeholder="Untitled" onKeyDown={handleEnter} onBlur={handleInputBlur}/>
                                        </Form.Item>
                                        <div className='cm-flex-center cm-cursor-pointer cm-input-submit-button' onClick={() => handleTitleSave()} onKeyDown={handleEnter}><MaterialSymbolsRounded font="check" filled color='#0176D3'/></div>
                                    </>
                                </Form>
                            :
                                <>
                                    <div className='cm-flex-align-center'>
                                        <Text className="cm-font-size18 cm-font-fam500" ellipsis={{tooltip: data?._rSections[0]?.title}} style={{ maxWidth: "200px", marginRight: "8px"}}>{data?._rSections[0]?.title}</Text>
                                        <div className='show-on-hover-icon'>
                                            <MaterialSymbolsRounded font="edit" size="14" className="cm-cursor-pointer" onClick={() => setEditView(true)}/>
                                        </div>
                                    </div>
                                </>
                            )
                        :
                            <Text className="cm-font-size18 cm-font-fam500" ellipsis={{tooltip: data?._rSections[0]?.title}} style={{ maxWidth: "200px", marginRight: "8px"}}>{data?._rSections[0]?.title}</Text>
                    }                    
                </div>
            </Space> */}

            <Form 
                className   =   'cm-padding15'
                layout      =   "vertical" 
                onFinish    =   {onFinish} 
                onChange    =   {onFinish}
                form        =   {form} 
                style       =   {{flexDirection: "column", height: "calc(100% - 51px)"}}
            >

                <Form.Item label={<Space size={4} className='cm-margin-bottom5 cm-font-fam500 cm-font-size16'>Resource type</Space>} name={"types"} >
                    <Checkbox.Group >
                        <Space direction='vertical'>
                            {
                                filteredResourceTypes.map((_assetType) => (
                                    <Checkbox className='cm-flex-align-center' key={_assetType.key} value={_assetType.key}><Space className='cm-margin-left5 cm-flex-center'><MaterialSymbolsRounded font={_assetType.displayIconName} size='18'/><span className='cm-font-fam500'>{_assetType.displayName}</span></Space></Checkbox>
                                ))
                            }
                        </Space>
                    </Checkbox.Group>
                </Form.Item>

                <Form.Item label={<Space size={4} className='cm-margin-bottom5 cm-font-fam500 cm-font-size16'>Category</Space>} name={"categories"} >
                    <Checkbox.Group >
                        <Space direction='vertical'>
                            {
                                $categories.map((_category: any) => (
                                    <Checkbox className='cm-flex-align-center' key={_category.uuid} value={_category.uuid}><Space className='cm-margin-left5 cm-flex-center'><Text ellipsis={{tooltip: _category.name}} style={{maxWidth: "200px"}} className='cm-font-fam500'>{_category.name}</Text></Space></Checkbox>
                                ))
                            }
                        </Space>
                    </Checkbox.Group>
                </Form.Item>
            </Form>
            <ResourceModal 
                isOpen      =   {isModalOpen.isOpen}
                onClose     =   {() => setIsModalOpen({isOpen: false, type: "", key: "", displayname: "", domain: "", imageIcon: ""})}
                type        =   {isModalOpen.type}
                uploadKey   =   {isModalOpen.key}
                displayName =   {isModalOpen.displayname}
                domain      =   {isModalOpen.domain}
                imageIcon   =   {isModalOpen.imageIcon}
            />
            <LibraryModal
                isOpen                  =   {showLibraryModal}
                onClose                 =   {() => setShowLibraryModal(false)}
                getSelectedResourceId   =   {(resource: any) => handleSelectResource(resource)}   
                initialFilter           =   {[]}
            />
        </div>
    )
}

export default ResourceFilter