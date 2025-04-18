import { useEffect, useState } from 'react';
import { useApolloClient, useQuery } from '@apollo/client';
import { Avatar, Button, Form, Image, Input, List, Space, Typography } from 'antd';

import { BUYERSTAGE_LOGO, BUYERSTAGE_WEBSITE_URL, Length_Input, official_email_regex } from '../../constants/module-constants';
import { BUYER_LANDING } from '../../buyer-view/api/buyers-query';
import { BuyerAgent } from '../../buyer-view/api/buyer-agent';
import { CommonUtil } from '../../utils/common-util';
import { APIHandler } from '../../api-handler';

import useLocalization from '../../custom-hooks/use-translation-hook';
import SomethingWentWrong from '../error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../MaterialSymbolsRounded';
import Loading from '../../utils/loading';
import Translate from '../Translate';
import '../../layout/layout.css';
import Emoji from '../Emoji';
import i18n from "../../i18n";

const { Text, Title }   =   Typography;
const { useForm }       =   Form;

const CommonLinkLanding = () => {
    
    const [form]                    =   useForm();

    const $client                   =   useApolloClient();
    const { translate }             =   useLocalization();

    const [formFlag, setFormFlag]   =   useState(false);

    const [submitState, setSubmitState]             =   useState({
        loading         :   false,
        text            :   translate("common-link.get-access")
    });

    const { data, loading, error }  =   useQuery(BUYER_LANDING, {
        fetchPolicy: "network-only",
        variables: {
            isPreview: true
        }
    });

    useEffect(() => {
        APIHandler.initialize($client)
    }, [$client]);

    useEffect(() => {
        (data && data?._pBuyerPortalLinks && data?._pBuyerPortalLinks.length === 0) ? setFormFlag(true) : null
    }, [data])

    useEffect(() => {
        if(data && data._pBuyerAccount?.language){
            i18n.changeLanguage(data._pBuyerAccount.language)
        }
    }, [data])

    const handleAccountSelect = (_buyerLink: string) => {        
        const urlParams = new URLSearchParams(window.location.search);  
        const resourceId = urlParams.get("resourceid");
        const sectionId = urlParams.get("sectionid");
        const widgetId = urlParams.get("widgetid");
        if (resourceId && sectionId) {
            window.open(`${_buyerLink}?resourceid=${resourceId}&sectionid=${sectionId}`, "_self");
        }else if (sectionId && widgetId) {
            window.open(`${_buyerLink}?sectionid=${sectionId}&widgetid=${widgetId}`, "_self");
        }else if (resourceId) {
            window.open(`${_buyerLink}?resourceid=${resourceId}`, "_self");
        }else if (sectionId) {
            window.open(`${_buyerLink}?sectionid=${sectionId}`, "_self");
        }else {
            window.open(_buyerLink, "_self");
        }
    }
    

    const handleFormClick = () => {
        setFormFlag((prev) => !prev)
    }

    const onFinish = (values: any) => {     
        setSubmitState({
            loading: true,
            text:   translate("common-link.creating-portal")
        })           
        BuyerAgent.selfInvite({
            variables: {
                emailId:   values.email
            },
            onCompletion: (data: any) => {
                setSubmitState({
                    loading: false,
                    text:   translate("common-link.get-access")
                })  
                handleAccountSelect(data?._pSelfInvite.link)            
            },
            errorCallBack: () => {
                setSubmitState({
                    loading: false,
                    text:   translate("common-link.get-access")
                })  
            }
        })
    }

    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong/>

    return (
        <div className='j-links-list-wrapper'>
            <div className='j-portal-user-listing-wrapper'>
                <Space direction='vertical' className='cm-flex-center cm-margin-bottom20' size={25} style={{paddingInline: "20px", paddingTop: "20px"}}>
                    <Space size={25}>
                        <Avatar className='j-template-listing-icon' shape="square" size={70} style={{color: "#000000D9", backgroundColor: "#fff", borderRadius: "7px", fontSize: "26px", opacity: "85%"}} src={data._pBuyerAccount.logoUrl}>
                            {CommonUtil.__getAvatarName(data._pBuyerAccount.companyName, 2)}
                        </Avatar>
                        <Emoji font="🤝" size="30"/>
                        <Avatar className="j-template-listing-icon" shape="square" size={70} style={{backgroundColor: "#fff", borderRadius: "7px", color: "#000000D9", fontSize: "30px", opacity: "85%"}} src={data._pBuyerAccount.sellerAccount.logoUrl}>
                            {CommonUtil.__getAvatarName(data._pBuyerAccount.sellerAccount.title, 2)}
                        </Avatar>
                    </Space>
                    <Space direction='vertical'>
                        <Title level={4} className='cm-flex-center cm-margin0 cm-text-align-center'>{data._pBuyerAccount.genericRoomLinkTitle}</Title>
                        {
                            formFlag 
                            ? 
                                <Text className='cm-flex-center cm-text-align-center cm-margin0' style={{color: "#000000D9", opacity: "85%"}}><Translate i18nKey='common-link.enter-email-text'/></Text>
                            :
                                <Text className='cm-flex-center cm-text-align-center cm-margin0' style={{color: "#000000D9", opacity: "85%"}}><Translate i18nKey='common-link.click-on-email'/></Text>
                        }
                    </Space>
                </Space>
                {
                    formFlag 
                    ?
                        <Space direction='vertical'>
                            <Form form={form} onFinish={onFinish} className='cm-form'>
                                <Form.Item name={"email"} rules={[{required: true, pattern: official_email_regex, message: translate("common-link.enter-work-email")}]}>
                                    <Input autoFocus style={{width: "350px"}} maxLength={Length_Input} size='large' placeholder={translate("common-link.enter-work-email")} allowClear/>
                                </Form.Item>
                            </Form>
                            <Space className='cm-margin-top10 cm-margin-bottom20 cm-flex-justify-end'>
                                <Button type='primary' ghost onClick={handleFormClick} className='cm-no-border-button'><Translate i18nKey='common-labels.cancel'/></Button>
                                <Button type="primary" className="cm-flex-center" onClick={() => form.submit()}>
                                    <Space size={10}>
                                        {submitState.text}
                                        {
                                            submitState.loading && <Loading color="#fff" size='small'/>
                                        }
                                    </Space>
                                </Button>
                            </Space>
                        </Space>
                    :
                        <>
                            <div className='cm-width100' style={{maxHeight: "calc(100vh - 375px)", overflow: "auto"}}>
                                <List
                                    itemLayout  =   "horizontal"
                                    dataSource  =   {data._pBuyerPortalLinks.filter((_portalLink: any) => _portalLink.status !== "IN_ACTIVE")}
                                    className   =   'cm-width100'
                                    style       =   {{paddingInline: "15px", paddingBottom: "20px"}}
                                    locale      =   {{emptyText: <div><Translate i18nKey='common-link.no-users-added'/></div>}}
                                    renderItem  =   {(_buyer: any) => (
                                        <List.Item className='cm-cursor-pointer j-portal-user-item cm-width100' style={{paddingInline: "10px"}} onClick={() => handleAccountSelect(_buyer.link)}>
                                            <Space>
                                                <Avatar size={45} style = {{backgroundColor: "#f2f2f2", color: "#000", fontSize: "14px" }} src={_buyer.profileUrl ? <img src={_buyer.profileUrl} alt={CommonUtil.__getFullName(_buyer.firstName, _buyer.lastName)}/> : ""}>
                                                    {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_buyer.firstName, _buyer.lastName),2)}
                                                </Avatar>
                                                <Space>
                                                    <div>
                                                        <div className="j-portal-buyer-name cm-font-fam500 cm-font-size15">{CommonUtil.__getFullName(_buyer.firstName, _buyer.lastName)}</div>
                                                        <div className="j-portal-buyer-name cm-font-size12">{_buyer.emailId}</div>
                                                    </div>
                                                </Space>
                                            </Space>
                                            <div>
                                                <Button onClick={() => handleAccountSelect(_buyer.link)}>Access</Button>
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            </div>
                            <div className='cm-flex-center cm-gap8 cm-padding-block10 cm-cursor-pointer cm-border-block cm-width100 j-add-mail-cta' onClick={handleFormClick}>
                                <Space className='cm-flex-center'>
                                    <div className='cm-font-fam400 cm-font-size12'><Translate i18nKey='common-link.no-email-message'/></div>
                                    <Space className='cm-flex-center cm-link-text' size={4}>
                                        <MaterialSymbolsRounded font="person_add_alt" size='16'/>
                                        <div className='cm-font-fam400 cm-font-size13'><Translate i18nKey='common-link.get-access'/></div>
                                    </Space>
                                </Space>
                            </div>
                        </>
                }
            </div>
            {
                !data._pBuyerAccount.sellerAccount.customDomain ?
                    <Space>
                        <div className='cm-font-fam400 cm-font-size10'>Powered by</div>
                        <a href={BUYERSTAGE_WEBSITE_URL} target='_blank'>
                            <Image preview={false} width={100}  src={BUYERSTAGE_LOGO} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= BUYERSTAGE_LOGO}}/> 
                        </a>
                    </Space>
                :
                    null
            }
        </div>
    )
}

export default CommonLinkLanding