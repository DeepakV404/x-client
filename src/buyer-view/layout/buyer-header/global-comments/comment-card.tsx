import { useContext, useRef, useState } from "react";
import { Avatar,  Form,  Space, Typography } from "antd";

import { BuyerGlobalContext } from "../../../../buyer-globals";
import { CommonUtil } from "../../../../utils/common-util";
import { BuyerAgent } from "../../../api/buyer-agent";
import { ERROR_CONFIG } from "../../../../config/error-config";

import DeleteConfirmation from "../../../../components/confirmation/delete-confirmation";
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import EditMessageBox from "../../../../components/comment-box/edit-message-box";

const { Text }      =   Typography
const { useForm }   =   Form;

const CommentCard = (props: {comments: any, seller: any, buyer: any, setFilter: any, scrollToBottom: any}) => {

    const { comments, seller, buyer, scrollToBottom} = props;

    let users = seller.concat(buyer);

    const { $buyerData }    =   useContext(BuyerGlobalContext); 

    const messageRef = useRef<any>(null);

    let currentBuyer = $buyerData?.buyers.filter((_buyer: any) => _buyer.isCurrentBuyer)[0];

    const [ form ]      =      useForm();

    const [editView, setEditView]                                =   useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation]    =   useState({
        visibility  :   false,
    })

    const getComment = () => {
        
        const getUserName = (userId: string) => {
            var mentionedUser = users.find((_user: any) => _user.uuid === userId);
            if (mentionedUser) {
                return CommonUtil.__getFullName(mentionedUser.firstName, mentionedUser.lastName);
            } else {
                const isSeller = seller.some((_seller: any) => _seller.uuid === userId);
                return isSeller ? "unknown_user" : "unknown_buyer";
            }
        }

        const parseUsers = (comment: string) => {
            return comment.replace(/\{@([bs])#([a-zA-Z0-9-]+)\}/g, function(_, __, parsedUserId: string) {
                const userName = getUserName(parsedUserId)
                return `<span class="cm-link-text">${userName}</span>`;
            });
        }

        const parseSection = (parseComment: any) => {            
            return parseComment.replace(/\{@sec#([a-zA-Z0-9-]+)\}/g, (matchedRegex: string, sectionId: string) => {               
                const mentionedSection = comments.metadata.mentions[matchedRegex];
        
                if (!mentionedSection) {
                    return "#unknown_section";
                }

                const sectionName = getSectionName(matchedRegex);
                const navigateTo = {
                    type: mentionedSection.type.toLowerCase(),
                    uuid: mentionedSection.uuid
                }; 
                if(!comments.metadata.mentions[matchedRegex]) return "#unknown_section"
                if(!comments.metadata.mentions[matchedRegex].isEnabled) return sectionName
                if(!comments.metadata.mentions[matchedRegex].isVisibleToAll){
                    if(comments.metadata.mentions[matchedRegex].enabledBuyerUuids.includes(currentBuyer.uuid)) return `<a class="j-section-name-in-comment" href="#/${sectionId}">${sectionName}</a>`;
                    else return sectionName
                }
                return `<a class="j-section-name-in-comment" href=${getNavigateLink(navigateTo)}>${sectionName}</a>`;
            });
        };

        const getNavigateLink = (navigateTo: {type: string, uuid: string}) => {                        
            switch(navigateTo.type){
                default   :   return `#/section/${navigateTo.uuid}`
            }            
        }

        const getSectionName = (matchedRegex: string) => { 
            const mentionedSection = comments.metadata.mentions[matchedRegex];
            if (mentionedSection) {
                return `#${mentionedSection.name}`;
            }
        };
        
        const parseEveryOneMention = (comment: any) => {
            return comment.replaceAll("@Everyone", () => {               
                return `<span class="cm-link-text">Everyone</span>`
            });
        }

        let userAndSectionParsedComment = parseEveryOneMention(parseSection(parseUsers(comments.comment)));

        return CommonUtil.__replaceURLInText(userAndSectionParsedComment)
        
    }

    const onFinish = () => {
        BuyerAgent.updateRoomMessage({
            variables: {
                commentUuid   :  comments.uuid,
                comment       :  messageRef.current.latestComment
            },
            onCompletion: () => {
                setEditView(false)
                CommonUtil.__showSuccess("Message updated successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleDeleteMessage = () => {
        BuyerAgent.deleteRoomMessage({
            variables: {
                commentUuid   :  comments.uuid
            },
            onCompletion: () => {
                setShowDeleteConfirmation({visibility: false})
                CommonUtil.__showSuccess("Message deleted successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    return (
        <>
            <div className="cm-flex cm-gap15 hover-item cm-margin-top10 cm-margin-bottom10">
                <div>
                    <Avatar size={35} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "15px" }} src={comments.createdStakeholder.profileUrl ? <img src={comments.createdStakeholder.profileUrl} alt={CommonUtil.__getFullName(comments.createdStakeholder.firstName, comments.createdStakeholder.lastName)}/> : ""}>
                        {CommonUtil.__getAvatarName(CommonUtil.__getFullName(comments.createdStakeholder.firstName, comments.createdStakeholder.lastName),1)}
                    </Avatar>
                </div>
                <div style={{width: "calc(100% - 40px)"}}>
                    <Space className="cm-width100 cm-flex-space-between" style={{height: "24px"}}>
                        {
                            currentBuyer.uuid === comments.createdStakeholder.uuid ?
                                <Text className="cm-font-size13 cm-secondary-text" style={{maxWidth: comments?.metadata?.actionPoint?.name ? "120px" : "200px"}}>You</Text>
                            :
                                <Text className="cm-font-size13 cm-secondary-text" style={{maxWidth: comments?.metadata?.actionPoint?.name ? "120px" : "200px"}} ellipsis={{tooltip: CommonUtil.__getFullName(comments.createdStakeholder.firstName, comments.createdStakeholder.lastName)}}>{CommonUtil.__getFullName(comments.createdStakeholder.firstName, comments.createdStakeholder.lastName)}</Text>
                        }
                        {
                            currentBuyer.uuid === comments.createdStakeholder.uuid  &&
                                <Space className="cm-secondary-text">
                                    {
                                        editView 
                                        ?
                                            <Space>
                                                <MaterialSymbolsRounded font="close" size="22" className="cm-cursor-pointer" onClick={() => {setEditView(false); scrollToBottom(true)}}/>
                                                <MaterialSymbolsRounded font="check" size="22" className="cm-cursor-pointer" onClick={() => {onFinish(); setEditView(false); scrollToBottom(true)}}/>
                                            </Space>
                                        :
                                            <div className='show-on-hover-icon cm-icon-wrap' onClick={() => setEditView(true)}>
                                                <MaterialSymbolsRounded font="edit" size="16" className="cm-cursor-pointer"/>
                                            </div>
                                    }
                                    {/* <MaterialSymbolsRounded font="delete" size="18" className="cm-cursor-pointer" onClick={() => setShowDeleteConfirmation({visibility: true})}/> */}
                                </Space>
                        }
                    </Space>
                    {
                        editView
                        ?
                            <Form form={form} className="cm-form cm-margin-bottom10 cm-flex-align-center" onFinish={onFinish}>
                                <Form.Item initialValue={comments.comment} className="cm-width100">
                                    <EditMessageBox messageRef={messageRef}  sellers={seller} buyers={buyer} onComplete={onFinish} initialValue={comments.comment}/>
                                </Form.Item>
                            </Form>
                        :
                            <div className="cm-font-size14 cm-font-fam400 cm-line-height23 cm-margin-bottom10 cm-margin-top5px" style={{letterSpacing: "0.2px", color: "#0E0B3D", wordBreak: "break-word"}} dangerouslySetInnerHTML={{__html: getComment().replace(/(?:\r\n|\r|\n)/g, '<br>')}}></div>
                    }
                    <div className="cm-font-size12" style={{opacity:"60%"}}>{CommonUtil.__format_AM_PM(comments.createdAt)}</div>
                </div>
            </div>
            <DeleteConfirmation
                isOpen      =   {showDeleteConfirmation.visibility}
                onOk        =   {() => {handleDeleteMessage()}}
                onCancel    =   {() => setShowDeleteConfirmation({visibility: false})}
                header      =   'Delete message'
                body        =   'Are you sure you want to delete this message?'
                okText      =   'Delete'
            />
        </>
    )
}

export default CommentCard