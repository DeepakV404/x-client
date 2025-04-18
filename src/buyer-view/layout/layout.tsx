import { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from 'antd';

import { BuyerGlobalContext } from '../../buyer-globals';

import BuyerHeader from './buyer-header';
import BuyerSider from './buyer-sider';
import BuyerBody from './buyer-body';
import BuyerChatWidgetPopover from './chat-window';

const BuyerLayout = (props: {isMobile: any, setIsIconAnimatingOut: any, isIconAnimatingOut: any, setIsProfileClicked: any, isProfileClicked: any}) => {

    const { isMobile, setIsIconAnimatingOut, isIconAnimatingOut, setIsProfileClicked, isProfileClicked }  =   props

    const { $showPreviewForm, $setShowPreviewForm, $buyerData} =   useContext<any>(BuyerGlobalContext);

    const [searchParams, setSearchParams]               =   useSearchParams();

    // const [showMessages, setShowMessages]            =   useState(false);

    const [collapsed, setCollapsed]                            =   useState(isMobile);
    const [isMessagePopoverOpen, setIsMessagePopoverOpen ]     =   useState(false);

    let searchParam     =     searchParams.get("messages");
    
    useEffect(() => {
        if(searchParams.get("messages") === "true"){
            setIsMessagePopoverOpen(true)
            // setShowMessages(true)
            // setCollapsed(true)
        }
    }, [searchParam])

    const handleMessagesClose = () => {
        setSearchParams({
            "messages" : 'false'
        })
        setIsMessagePopoverOpen(false)
        // setShowMessages(false)
    }

    const handleMessageOpen = () => {
        setSearchParams({
            "messages" : 'true'
        })
        // setShowMessages(true)
        // setCollapsed(true)
        
    }

    const handleSiderOpen = () => {
        setCollapsed(false)
        // setShowMessages(false)
        setSearchParams({
            "messages" : 'false'
        })
    }
    
    return (
        <>
            <Layout>
                <BuyerSider 
                    isMobile            =   {isMobile} 
                    setShowPreviewForm  =   {$setShowPreviewForm} 
                    showPreviewForm     =   {$showPreviewForm} 
                    collapsed           =   {collapsed} 
                    setCollapsed        =   {setCollapsed}
                />
                <Layout>
                    <BuyerHeader 
                        handleSiderOpen     =   {handleSiderOpen}
                        setShowPreviewForm  =   {$setShowPreviewForm} 
                        showPreviewForm     =   {$showPreviewForm} 
                        collapsed           =   {collapsed} 
                        isMobile            =   {isMobile} 
                        // showMessages        =   {showMessages}
                        // handleMessageOpen   =   {handleMessageOpen}
                        showCollapseIcon    =   {true}
                    />
                    <BuyerBody 
                        setShowPreviewForm      =   {$setShowPreviewForm} 
                        isProfileClicked        =   {isProfileClicked} 
                        setIsProfileClicked     =   {setIsProfileClicked} 
                        isIconAnimatingOut      =   {isIconAnimatingOut} 
                        setIsIconAnimatingOut   =   {setIsIconAnimatingOut} 
                        handleMessageOpen       =   {handleMessageOpen}
                    />
                    {
                        ($buyerData.sellerAccount.tenantName !== "kissflow") && 
                            <BuyerChatWidgetPopover
                                handleMessageOpen       =   {handleMessageOpen}
                                handleMessagesClose     =   {handleMessagesClose}
                                isMessagePopoverOpen    =   {isMessagePopoverOpen}
                                setIsMessagePopoverOpen =   {setIsMessagePopoverOpen}
                                isMobile                =   {isMobile} 
                            />
                    }
                </Layout>
                {/* <Sider trigger={null} collapsedWidth={0} collapsible={true} collapsed={!showMessages} width={350} style={{background: "#fefefe", borderLeft: "1px solid #eeeeee", position: isMobile ? "absolute" : "relative", height: isMobile ? "100%" : "unset", zIndex: isMobile ? 2 : "unset"}}>
                    { showMessages && <GlobalComments handleMessagesClose={handleMessagesClose}/> }
                </Sider> */}
            </Layout>
        </>
    )
}

export default BuyerLayout