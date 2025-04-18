import { Avatar, Form, Space, Typography} from "antd";
import { useContext, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { PermissionCheckers } from "../../../config/role-permission";
import { FEATURE_ROOMS } from "../../../config/role-permission-config";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { GlobalContext } from "../../../globals";
import { RoomsAgent } from "../api/rooms-agent";

import EditMessageBox from "../../../components/comment-box/edit-message-box";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import DeleteConfirmation from "../../../components/confirmation/delete-confirmation";

const { Text }      =   Typography;
const { useForm }   =   Form;

const RoomCommentItem = (props: {comment: any, seller: any, buyer: any, setFilter: any, scrollToBottom: any}) => {

    const { comment, seller, buyer, scrollToBottom } = props;
    
    const { accountId, roomId }    =   useParams();

    const { $user }  =   useContext(GlobalContext);

    const [ form ]   =   useForm();

    const RoomCommentPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const messageRef        =   useRef<any>(null);

    let users = seller?.concat(buyer)

    const [editView, setEditView]                                =   useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation]    =   useState({
        visibility  :   false,
    })

    const getComment = () => {

        const parseUsers = (comment: string) => {
            return comment.replace(/\{@([bs])#([a-zA-Z0-9-]+)\}/g, function(_, __, parsedUserId: string) {
                const userName = getUserName(parsedUserId)
                return `<span class="cm-link-text">${userName}</span>`;
            });
        }

        const getUserName = (userId: string) => {
            var mentionedUser = users.find((_user: any) => _user.uuid === userId);
            if (mentionedUser) {
                return CommonUtil.__getFullName(mentionedUser.firstName, mentionedUser.lastName);
            } else {
                const isSeller = seller.some((_seller: any) => _seller.uuid === userId);
                return isSeller ? "unknown_user" : "unknown_buyer";
            }
        }

        const parseSection = (parsedComment: string) => {            
            return parsedComment.replace(/\{@sec#([a-zA-Z0-9-]+)\}/g, (matchedRegex: any) => {                              
                const mentionedSection = comment.metadata.mentions[matchedRegex];
        
                if (!mentionedSection) {
                    return "#unknown_section";
                }

                const sectionName = getSectionName(matchedRegex);
                const navigateTo = {
                    type: mentionedSection.type.toLowerCase(),
                    uuid: mentionedSection.uuid
                };               
                return sectionName ? `<a class="j-section-name-in-comment" href=${getNavigateLink(navigateTo)}>${sectionName}</a>`: "#unknown_section"
            });
        };

        const getNavigateLink = (navigateTo: {type: string, uuid: string}) => {                        
            switch(navigateTo.type){
                case "talk_to_us"       :   return `#rooms/${accountId}/${roomId}/sections/${navigateTo.uuid}`
                case "welcome"          :   return `#rooms/${accountId}/${roomId}/sections/${navigateTo.uuid}`
                case "custom_section"   :   return `#rooms/${accountId}/${roomId}/sections/${navigateTo.uuid}`
                case "demo"             :   return `#rooms/${accountId}/${roomId}/sections/${navigateTo.uuid}`
                case "resources"        :   return `#rooms/${accountId}/${roomId}/${navigateTo.type}`
                case "next_steps"       :   return `#rooms/${accountId}/${roomId}/collaboration`
                case "faq"              :   return `#/settings/faqs target="_blank"`
            }            
        }

        const getSectionName = (matchedRegex: string) => { 
            if (comment?.metadata.hasMentionsData) {
                const mentionedSection = comment.metadata.mentions[matchedRegex];
                if (mentionedSection) {
                    return `#${mentionedSection.name}`;
                }
            }
        };

        const parseEveryOneMention = (comment: any) => {
            return comment.replaceAll("@Everyone", () => {               
                return `<span class="cm-link-text">Everyone</span>`
            });
        }

        let userAndSectionParsedComment = parseEveryOneMention(parseSection(parseUsers(comment.comment)));

        return CommonUtil.__replaceURLInText(userAndSectionParsedComment)
        
    }

    const onFinish = () => {
        RoomsAgent.updateMessageInRoom({
            variables: {
                commentUuid   :  comment.uuid,
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
        RoomsAgent.deleteMessageInRoom({
            variables: {
                commentUuid   :  comment.uuid
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

    return(
        <>
            <div className="j-action-comment-section hover-item">
                <div>
                    <Avatar size={35} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "15px", display: "flex" }} src={comment.createdStakeholder.profileUrl ? <img src={comment.createdStakeholder.profileUrl} alt={CommonUtil.__getFullName(comment.createdStakeholder.firstName, comment.createdStakeholder.lastName)}/> : ""}>
                        {CommonUtil.__getAvatarName(CommonUtil.__getFullName(comment.createdStakeholder.firstName, comment.createdStakeholder.lastName),1)}
                    </Avatar>
                </div>
                <div style={{wordBreak: "break-word"}} className="cm-width100">
                    <div className="cm-flex-space-between" style={{height: "24px"}}>
                        {
                            $user.uuid === comment.createdStakeholder.uuid ?
                                <Text className="cm-font-size13 cm-secondary-text" style={{maxWidth: comment?.metadata?.actionPoint?.name ? "120px" : "200px"}}>You</Text>
                            :
                                <Text className="cm-font-size13 cm-secondary-text" style={{color: "background: #000000D9", maxWidth: "250px"}} ellipsis={{tooltip: CommonUtil.__getFullName(comment.createdStakeholder.firstName, comment.createdStakeholder.lastName)}}>{CommonUtil.__getFullName(comment.createdStakeholder.firstName, comment.createdStakeholder.lastName)}</Text>
                        }
                        {
                            RoomCommentPermission && $user.uuid === comment.createdStakeholder.uuid &&
                                <Space className="cm-secondary-text" style={{height: "30px"}}>
                                    {
                                        editView
                                        ?
                                            <Space>
                                                <MaterialSymbolsRounded font="close" size="22" className="cm-cursor-pointer" onClick={() => {setEditView(false); scrollToBottom(true)}}/>
                                                <MaterialSymbolsRounded font="check" size="22" className="cm-cursor-pointer" onClick={(event: any) => {event.stopPropagation(); onFinish(); setEditView(false); scrollToBottom(true)}}/>
                                            </Space>
                                        :
                                            <div className='show-on-hover-icon cm-icon-wrap' onClick={() => setEditView(true)}>
                                                <MaterialSymbolsRounded font="edit" size="16" className="cm-cursor-pointer"/>
                                            </div>
                                    }
                                    {/* <MaterialSymbolsRounded font="delete" size="18" className="cm-cursor-pointer" onClick={() => setShowDeleteConfirmation({visibility: true})}/> */}
                                </Space>
                        }

                        {/* {comment?.metadata?.actionPoint && <span className="cm-font-size11 cm-light-text cm-cursor-pointer" onClick={() => setFilter(comment?.metadata?.actionPoint)}>from <span className="cm-secondary-text">{comment?.metadata?.actionPoint?.name}</span></span>} */}
                    </div>
                    {
                        editView
                        ?
                            <Form form={form} className="cm-form cm-width100 cm-margin-bottom10 cm-flex-align-center">
                                <Form.Item className="cm-width100">
                                    <EditMessageBox messageRef={messageRef} sellers={seller} buyers={buyer} onComplete={onFinish} message={true} initialValue={comment.comment}/>
                                </Form.Item>
                            </Form>
                        :
                            <div className="cm-font-size14 cm-font-fam400 cm-line-height23 cm-margin-bottom10 cm-margin-top5px" style={{letterSpacing: "0.2px", color: "#0E0B3D", wordBreak: "break-word"}} dangerouslySetInnerHTML={{__html: getComment().replace(/(?:\r\n|\r|\n)/g, '<br>')}}></div>
                    }
                    <div className="cm-font-size12" style={{opacity:"60%"}}>{CommonUtil.__format_AM_PM(comment.createdAt)}</div>
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

export default RoomCommentItem