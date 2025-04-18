import { useParams } from "react-router-dom";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Mention, MentionsInput } from "react-mentions";
import { useQuery } from "@apollo/client";
import { Space, Typography } from "antd";
import { toLower } from "lodash";

import { PREVIEW_USER_ICON } from "../../constants/module-constants";
import { R_SECTIONS } from "../../pages/rooms/api/rooms-query";
import { P_SECTIONS } from "../../buyer-view/api/buyers-query";
import { CommonUtil } from "../../utils/common-util";

import useLocalization from "../../custom-hooks/use-translation-hook";
import MaterialSymbolsRounded from "../MaterialSymbolsRounded";
import Emoji from "../Emoji";

const { Text }  =   Typography;

const EditMessageBox = (props :{messageRef: any,  onComplete: any, sellers?: any, buyers?: any, message? : boolean, initialValue : any}) => {

    const { messageRef, onComplete, sellers, buyers, message, initialValue } = props;

    const { roomId }        =   useParams();
    const inputRef          =   useRef<any>(null);
    const { translate }     =   useLocalization();

    const initialCommentParser = (initialComment: string) => {
        return initialComment.replace(/\{@([bs])#([a-zA-Z0-9-]+)\}/g, function(_: string, __: string, userID: string) {
            return `{@u#${userID}}`;
        });
    }

    const [value, setValue] = useState(initialCommentParser(initialValue));

    const { data: sectionsData } = message ? useQuery(R_SECTIONS, {
        variables: { 
            roomUuid: roomId 
        },
        fetchPolicy: "network-only"
    }) : useQuery(P_SECTIONS, {
        fetchPolicy: "network-only"
    });


    const getComment = (comment: any) => {
        let users = sellers?.concat(buyers);

        let formattedComment = comment.replace(/\{@u#([a-zA-Z0-9-]+)\}/g, function(commentId: string, parsedId: string) {
            let path: any = users?.find((_user: any) => _user.uuid === parsedId);
            if (parsedId === 'Everyone') {
                return `@Everyone`
            }
            if(path) {
                if(path?.__typename === "AccountUserOutput"){
                    return `{@s#${parsedId}}`;
                } else {
                    return `{@b#${parsedId}}`;
                }
            }
            return commentId;
        });

        return formattedComment;
    };

    useImperativeHandle(messageRef, () => ({
        latestComment:  getComment(value)
    }))
    
    const getSections = () => {
        const sections = message ? sectionsData?._rSections : sectionsData?._pSections;
        return sections?.map((item: any) => ({ id: item.uuid, emoji: item.emoji, sectionName: item.title })) || [];
    };

    const getSectionName = (id: string) => {
        const sections = message ? sectionsData?._rSections : sectionsData?._pSections;
        const section = sections?.find((item: any) => item.uuid === id);
        return `#${section ? section.title : "unknown_section"}`;
    }; 

    const onFinish = () => {
        if(!value.trim()){
            return CommonUtil.__showError("Comment cannot be empty!")
        }
        onComplete(getComment(value))
    }

    useEffect(() => {
        if (inputRef.current) {
            const input = inputRef.current;
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
        }
    }, []);

    const mentionData = message ?  
        [
            ...((sellers || []).filter((user: any) => user.status !== "DELETED").map((item: any) => ({ id: item.uuid, display: CommonUtil.__getFullName(item.firstName, item.lastName), emailId: item.emailId, profileImage: item.profileUrl, type: 'seller' }))),
            ...((buyers || []).filter((user: any) => user.status !== "DELETED").map((item: any) => ({ id: item.uuid, display: CommonUtil.__getFullName(item.firstName, item.lastName), emailId: item.emailId, profileImage: item.profileUrl, type: 'buyer' }))),
            { id: 'Everyone', display: 'Everyone', emailId: '', profileImage: PREVIEW_USER_ICON, type: '' },
        ] 
    :
        [
            ...((buyers || []).filter((user: any) => user.status !== "DELETED").map((item: any) => ({ id: item.uuid, display: CommonUtil.__getFullName(item.firstName, item.lastName), emailId: item.emailId, profileImage: item.profileUrl, type: 'buyer' }))),
            ...((sellers || []).filter((user: any) => user.status !== "DELETED").map((item: any) => ({ id: item.uuid, display: CommonUtil.__getFullName(item.firstName, item.lastName), emailId: item.emailId, profileImage: item.profileUrl, type: 'seller' }))),
            { id: 'Everyone', display: 'Everyone', emailId: '', profileImage: PREVIEW_USER_ICON, type: '' },
        ] 

    const getName = (id: string) => {
        if (id === 'Everyone') {
            return '@Everyone';
        }
        let user = (sellers || []).concat(buyers || []).find((user: any) => user.uuid === id);
        return `@${user ? CommonUtil.__getFullName(user.firstName, user.lastName) : id}`;
    };

    const handleEnter = (event: any) => {
        if (event.keyCode == 13 && !event.shiftKey) {
            event.preventDefault()
            onFinish()
        }
    }
    
    return (
        <MentionsInput 
            style                         =   {{height: "100px"}}
            className                     =   "j-comment-mention"
            allowSuggestionsAboveCursor   =   {true}
            value                         =   {value} 
            inputRef                      =   {inputRef}
            onChange                      =   {(e => setValue(e.target.value))} 
            onKeyDown                     =   {(event) => handleEnter(event)} 
            placeholder                   =   {message ? "Press ⌘ + Return to leave a message and @ to mention" : translate("common-placeholder.comment-box")}
        >
            <Mention
                    trigger             =   "@"
                    data                =   {mentionData ?? []}
                    markup              =   {"{@u#__id__}"}
                    displayTransform    =   {(id) => getName(id)}
                    renderSuggestion    =   {(user: any, _, __, index: number) => {
                        const isFirstSeller = user.type === 'seller' && (index === 0 || mentionData[index - 1]?.type !== 'seller');
                        const isFirstBuyer = user.type === 'buyer' && (index === 0 || mentionData[index - 1]?.type !== 'buyer');
                        if (user.id === 'Everyone') {
                            return (
                                <Space className={`j-comment-mention-item cm-font-fam500`} size={12}>
                                    <div className="j-everyone-icon">
                                        <MaterialSymbolsRounded font="groups" size="16"/>
                                    </div>
                                    <Text className="cm-font-fam500">{user.display}</Text>
                                </Space>
                            );
                        }
                        return (
                            <>
                                {isFirstSeller && <div className={`j-comment-mention-header cm-background-white cm-light-text cm-padding-left15 cm-padding5 ${!message && "cm-margin-top5"} cm-font-size12`}>{message ? "Team Members" : "Sales Team"}</div>}
                                {isFirstBuyer && <div className={`j-comment-mention-header cm-background-white cm-light-text cm-padding-left15 cm-padding5 ${message && "cm-margin-top5"} cm-font-size12`}>{message ? "Buying Committee" : "Your People"}</div>}
                                <div className="j-comment-mention-item cm-font-fam500">
                                    <div className="cm-flex-align-center" style={{columnGap: "12px"}}>
                                        <img className="cm-object-fit-scale-down cm-border-light cm-border-radius6" height={28} width={28} src={user.profileImage ?? PREVIEW_USER_ICON} />
                                        <Space direction="vertical" size={0}>
                                            <Text ellipsis={{tooltip: user.display}} style={{maxWidth: "180px", lineHeight: "16px"}} className="cm-font-fam500">{user.display}</Text>
                                            <Text ellipsis={{tooltip: user.emailId}} style={{maxWidth: "150px", lineHeight: "14px"}} className="cm-font-size12">{user.emailId}</Text>
                                        </Space>
                                    </div>
                                </div>
                            </>
                        )
                    }}
                />
            <Mention
                appendSpaceOnAdd
                trigger             =   "#"
                data                =   {(search: any) => getSections().filter((_item: any) => toLower(_item.sectionName).includes(toLower(search)))}
                markup              =   {"{@sec#__id__}"}
                displayTransform    =   {(id) => getSectionName(id)}
                renderSuggestion    =   {(_section: any, _, __, index: number) => {
                    return(
                        <>
                            {index === 0 && <div className="j-comment-mention-header cm-background-white cm-padding-bottom10 cm-light-text">Sections</div>}
                            <div className="j-comment-mention-item cm-font-fam500">
                                <Space>
                                    <Emoji font={_section.emoji} size="14"/>
                                    <Text className="cm-font-fam500">{_section.sectionName}</Text>
                                </Space>
                            </div>
                        </>
                    )
                }}
            />
        </MentionsInput>
    )
}

export default EditMessageBox