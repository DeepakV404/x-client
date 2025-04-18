import { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Button, Col, Form, Input, Row, Space, Select, Card, Typography } from "antd";

import { ACCEPTED_VIDEO_TYPES, Length_Input, THUMBNAIL_FALLBACK_ICON } from "../../../constants/module-constants";
import { MP_CATEGORIES, MP_INDUSTRIES, MP_OVERVIEW, MP_OVERVIEW_VIDEO } from "../api/settings-query";
import { useBuyerResourceViewer } from '../../../custom-hooks/resource-viewer-hook';
import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';
import { SettingsAgent } from '../api/settings-agent';
import { GlobalContext } from "../../../globals";

import SellerResourceViewerModal from '../../resource-viewer/seller-resource-viewer-modal';
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import LibraryModal from "../../rooms/library/library-modal/library-modal";
import ResourceDrawer from "./resource-drawer";
import Loading from "../../../utils/loading";

const { useForm }            =   Form;
const { Option, OptGroup}    =   Select;
const { TextArea }           =   Input;
const { Text }               =   Typography;

const Overview = (props: {isHomePage?: boolean}) => {

    const { isHomePage }    =   props;

    const [ form ]    =     useForm();

    const { $dictionary, $orgDetail }     =    useContext(GlobalContext);

    const { viewResourceProp, handleResourceOnClick }   =   useBuyerResourceViewer();

    const [showResourceDrawer, setShowResourceDrawer]       =   useState(false);
    const [showLibrary, setShowLibrary]                     =   useState<boolean>(false);
    const [uploadType, setUploadType]                       =   useState('link');

    const [overview, setOverview]                           =   useState({
        tagline     :   null,
        categories  :   [],
        industries  :   [],
        description :   null
    })
    
    const { data }    =   useQuery(MP_OVERVIEW,{
        fetchPolicy: "network-only",
    });

    const { data: videoData }    =   useQuery(MP_OVERVIEW_VIDEO,{
        fetchPolicy: "network-only",
    });


    const { data: cData, loading: cLoading }    =   useQuery(MP_CATEGORIES);

    const { data: industryData, loading: iLoading }    =   useQuery(MP_INDUSTRIES);

    useEffect(() => {
        if(data){
            const overview = data._mpOverview;
            setOverview({
                tagline     : overview.tagline,
                description : overview.description,
                categories  : overview.categories.map((_categoryGroup: any) => _categoryGroup.tags).flat().map((_category: any) => _category.uuid),
                industries  : overview.industries.map((_industry: any) => _industry.uuid)
            })
            form.setFieldsValue({
                ["tagline"]     :   overview.tagline,
                ["description"] :   overview.description,
                ["categories"]  :   overview.categories.map((_categoryGroup: any) => _categoryGroup.tags).flat().map((_category: any) => _category.uuid),
                ["industries"]  :   overview.industries.map((_industry: any) => _industry.uuid),
            })
        }
    }, [data, form])

    const handleOpenDrawer = (type: any) => {
        setUploadType(type);
        setShowResourceDrawer(true);
    };

    const [submitState, setSubmitState]     =   useState({
        text: "Submit",
        loading: false
    });

    const onFinish = (values: any) => {
        setSubmitState({
            text: "Saving",
            loading  : true
        })

        SettingsAgent.mpUpdateOverview({
            variables: {
                overviewInput : {
                    tagline         : values.tagline,
                    description     : values.description,
                    industries      : values.industries,
                    categories      : values.categories,
                }
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Overview updated successfully")
                setSubmitState({
                    text: "Save",
                    loading: false
                })
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                setSubmitState({
                    text: "Save",
                    loading: false
                })
            }
        })
    }

    const handleResourceSubmit = (resource: any) => {
        if(uploadType === 'link') {
            SettingsAgent.mpUpdateOverviewVideo({
                variables: {
                    overviewInput : {
                        videoResourceInput: {
                            link    :    resource.link ? resource.link : undefined,
                        }
                    },
                },
                onCompletion: () => {},
                errorCallBack: () => {}
            })
        } else {
            SettingsAgent.mpUpdateOverviewVideo({
                variables: {
                    videoContent : resource[0].originFileObj
                },
                onCompletion: () => {},
                errorCallBack: () => {}
            })
        }
    };

    const handleAddResource = (resources: any) => {
        setShowLibrary(false)
        SettingsAgent.mpUpdateOverviewVideo({
            variables: {
                overviewInput:{
                    videoResourceInput: {
                        uuid: resources.uuid
                    }
                },
            },
            onCompletion: () => {},
            errorCallBack: () => {}
        })
    }

    const handleTagLineChange = (event: any) => {
        setOverview((prevOverview: any) => ({...prevOverview, "tagline" : event.target.value}))
    }

    const getCategories = (categories: any) => {
        const categoriesList      = cData?._mpCategories.map((_categoryGroup: any) => _categoryGroup.tags).flat()
        const selectedCategories  = categoriesList?.filter((_category: any) => categories.some((_id: string) => _category.uuid === _id));
        return selectedCategories?.map((_category: any) => _category.name).join(", ")
    }

    const getIndustries = (industries: any) => {
        const selectedIndustries  = industryData?._mpIndustries?.filter((_industry: any) => industries.some((_id: string) => _industry.uuid === _id));
        return selectedIndustries?.map((_industry: any) => _industry.name).join(", ")
    }

    const handleSelectChange = (value: any, key: string) => {
        setOverview((prevOverview: any) => ({...prevOverview, [key] : value}))
    }

    const overviewResourceCard = (resource: any) => {
        return (
            <div onClick={() => handleResourceOnClick(resource)} className={`cm-flex cm-flex-align-center cm-cursor-pointer cm-width100 cm-border-radius6 cm-padding10 cm-margin-top15 ${isHomePage ? "cm-background-white" : ""}`} style={{border: "1px solid #f2f2f2", columnGap: "10px"}}>
                <div style={{width: "106px", height: "60px"}}>
                    <img src={resource.content.thumbnailUrl ? resource.content.thumbnailUrl : CommonUtil.__getResourceFallbackImage(resource.content.type)} style={{width: "100%", height: "100%", borderRadius: "6px", objectFit: "scale-down"}} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= THUMBNAIL_FALLBACK_ICON}}/>
                </div>
                <div style={{width: "calc(100% - 180px)"}}>
                    <Text style={{maxWidth: "100%"}} ellipsis={{tooltip: resource.title}} className='cm-font-size15 cm-font-fam500'>{resource.title}</Text>
                </div>
            </div>
        )
    }

    return(
        <>
            <div className={`${!isHomePage ? "cm-padding20 j-setting-marketplace-body" : ""}`}>
                <Form form={form} layout="vertical" className="cm-form" onFinish={onFinish}>   
                    <Row className="cm-flex cm-margin0" gutter={20}>
                        <Col span={16} style={{paddingLeft: "0px"}}>
                            <Form.Item label={<div className="cm-font-opacity-black-65 cm-font-size13">Tag Line</div>} name="tagline" initialValue={overview.tagline}>
                                <Input id='tagline' autoFocus placeholder="Eg: The property operations platform designed for time." maxLength={Length_Input} allowClear size="large" onChange={handleTagLineChange}/>
                            </Form.Item>
                            <Form.Item label="Category" name="categories" initialValue={overview.categories}>
                                <Select 
                                    showSearch
                                    allowClear
                                    id                  =   'categories'
                                    size                =   "large" 
                                    optionFilterProp    =   "children"
                                    mode                =   'multiple'
                                    maxTagCount         =   'responsive'
                                    className           =   "cm-width100 cm-select"
                                    placeholder         =   "Eg: CRM, Customer Support, etc."
                                    loading             =   {cLoading}
                                    disabled            =   {cLoading}
                                    onChange            =   {(selectedValues: any) => handleSelectChange(selectedValues, "categories")}
                                    suffixIcon          =   {<MaterialSymbolsRounded font="expand_more" size="18"/>}
                                >
                                    {cData?._mpCategories?.map((_category: any) => (
                                        <OptGroup label={_category.group.name} key={_category.group.uuid}>
                                            {_category.tags?.map((tag: any) => (
                                                <Option value={tag.uuid} key={tag.uuid}>{tag.name}</Option>
                                            ))}
                                        </OptGroup>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label={<div className="cm-font-opacity-black-65 cm-font-size13">Industry</div>} name="industries" initialValue={overview.industries}>
                                <Select 
                                    showSearch
                                    allowClear
                                    id                  =   'industries'
                                    size                =   "large" 
                                    optionFilterProp    =   "children"
                                    className           =   "cm-width100 cm-select" 
                                    mode                =   'multiple'
                                    maxTagCount         =   'responsive'
                                    placeholder         =   "Eg: Healthcare, Software, etc."
                                    loading             =   {iLoading}
                                    disabled            =   {iLoading}
                                    onChange            =   {(selectedValues: any) => handleSelectChange(selectedValues, "industries")}
                                    suffixIcon          =   {<MaterialSymbolsRounded font="expand_more" size="18"/>}
                                >
                                    {industryData?._mpIndustries.map((_industry: any) => (
                                        <Option value={_industry.uuid} key={_industry.uuid} >{_industry.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item> 

                            <Form.Item label={<div className="cm-font-opacity-black-65 cm-font-size13">Description</div>} name="description" initialValue={overview.description}>
                                <TextArea placeholder="" rows={8} allowClear size='large'/>
                            </Form.Item>

                            <Form.Item label={<div className="cm-font-opacity-black-65 cm-font-size13">Product Overview Video</div>} name="resource">
                                <Space className="j-marketplace-overview-res-card cm-flex-center" size={20}>
                                    <div className="j-marketplace-res-upload-card cm-flex-center" onClick={() => handleOpenDrawer('link')}>
                                        <Space direction="vertical" className="cm-flex-center">
                                            <MaterialSymbolsRounded font="link"/>
                                            <div>Paste Url</div>
                                        </Space>
                                    </div>
                                    <div className="j-marketplace-res-upload-card cm-flex-center" onClick={() => setShowLibrary(true)}>
                                        <Space direction="vertical" className="cm-flex-center">
                                            <MaterialSymbolsRounded font="home_storage"/>
                                            <div>from {$dictionary.library.title}</div>
                                        </Space>
                                    </div>
                                    <div className="j-marketplace-res-upload-card cm-flex-center" onClick={() => handleOpenDrawer('blob')}>
                                        <Space direction="vertical" className="cm-flex-center">
                                            <MaterialSymbolsRounded font="upload"/>
                                            <div>from Device</div>
                                        </Space>
                                    </div>
                                </Space>
                                <div style={isHomePage ? {paddingInline: "15%"} : {}}>
                                    {videoData?._mpOverview?.productVideo && overviewResourceCard(videoData?._mpOverview?.productVideo)}
                                </div>
                            </Form.Item>
                            {
                                isHomePage &&
                                    <div style={{paddingInline: "15%"}}>
                                        <Button block type='primary' className="j-setting-footer-btn cm-flex-center cm-margin-bottom20 cm-margin-top20" onClick={() => form.submit()}>
                                            <Space size={10}>
                                                {submitState.text}
                                                {submitState.loading && <Loading color="#fff"/>}
                                            </Space>
                                        </Button>
                                    </div>
                            }
                        </Col>

                        <Col span={8} className="cm-margin-top20">
                           <Card className="cm-border-radius12">
                                <div style={{opacity: "37%", position: "absolute", right: "24px"}}>Preview</div>
                                <Space direction="vertical" size={15} className='cm-width100'>
                                    <img src={$orgDetail?.logoUrl} alt="" height={100} width={100} style={{borderRadius: "24px"}}/>
                                    <div className="cm-font-fam600 cm-font-size24">{$orgDetail?.companyName}</div>
                                    <div className="cm-secondary-text" style={{wordBreak: "break-word"}}>{overview.tagline}</div>
                                    <Row gutter={20}>
                                        <Col flex={"100px"}>
                                            <div className="cm-secondary-text" style={{opacity: "67%"}}>Category</div>
                                        </Col>
                                        <Col flex="auto" style={{width: "calc(100% - 100px)"}}>
                                            <div className="cm-margin-bottom10">{(overview.categories && overview.categories.length > 0) ? getCategories(overview.categories) : "-"}</div>
                                        </Col>
                                    </Row>
                                    <Row gutter={20}>
                                        <Col flex={"100px"}>
                                            <div className="cm-secondary-text" style={{opacity: "67%"}}>Industry</div>
                                        </Col>
                                        <Col flex="auto" style={{width: "calc(100% - 100px)"}}>
                                            <div className="cm-margin-bottom10">{(overview.industries && overview.industries.length > 0) ? getIndustries(overview.industries) : "-"}</div>
                                        </Col>
                                    </Row>
                                    {/* {
                                        !isHomePage &&
                                            <Button className='cm-border-radius6' block type='primary' style={{background: "#5729ff", border: "1.5px solid linear-gradient(88.99deg, #6E46FF 12.62%, #AB94FF 96.75%)" , height: "45px"}}>
                                                <div style={{height: "13px", width: "100px", background: "#7954FF", borderRadius: "2px"}}></div>
                                            </Button>
                                    } */}
                                </Space>
                           </Card>
                        </Col>
                    </Row>
                </Form>
            </div>
            {
                !isHomePage &&
                    <div className="j-setting-marketplace-footer cm-width100">
                        <Button type='primary' className="j-setting-footer-btn cm-flex-center" onClick={() => form.submit()}>
                            <Space size={10}>
                                {submitState.text}
                                {submitState.loading && <Loading color="#fff"/>}
                            </Space>
                        </Button>
                    </div>
            }
            <LibraryModal
                isOpen                  =   {showLibrary}
                onClose                 =   {() => setShowLibrary(false)}
                initialFilter           =   {[]}
                getSelectedResourceId   =   {(resources: any) => handleAddResource(resources)}
                multipleResource        =   {false}
            />
            <ResourceDrawer
                isOpen      =   {showResourceDrawer}
                onClose     =   {() => setShowResourceDrawer(false)}
                uploadType  =   {uploadType}
                onSubmit    =   {handleResourceSubmit}
                maxCount    =   {1} 
                fileType    =   {ACCEPTED_VIDEO_TYPES}
            />

            <SellerResourceViewerModal
                isOpen          =   {viewResourceProp.isOpen}
                onClose         =   {viewResourceProp.onClose}
                fileInfo        =   {viewResourceProp.resourceInfo}
                track           =   {false}
            />
        </>    
    )
}

export default Overview