import { FC } from "react";
import { Avatar, Space } from "antd";

import { CommonUtil } from "../../../utils/common-util";

interface CommentBoxProps
{
    comment :   any;
}

const CommentBox: FC<CommentBoxProps> = (props) =>{

    const { comment } = props;

    return(
        <div key={comment.uuid} className="j-action-comment-section">
            <Space>
                <Avatar size={35} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "15px", display: "flex" }} src={comment.createdStakeholder.profileUrl ? <img src={comment.createdStakeholder.profileUrl} alt={CommonUtil.__getFullName(comment.createdStakeholder.firstName, comment.createdStakeholder.lastName)}/> : ""}>
                    {CommonUtil.__getAvatarName(CommonUtil.__getFullName(comment.createdStakeholder.firstName, comment.createdStakeholder.lastName),1)}
                </Avatar>
            </Space>
            <div style={{wordBreak: "break-word"}}>
                <Space direction="vertical">
                    <Space direction="horizontal" size={4}>
                        <div className="j-comment-author-name cm-font-size14 cm-font-fam600">{CommonUtil.__getFullName(comment.createdStakeholder.firstName, comment.createdStakeholder.lastName)}</div>
                        <div className="j-comment-time cm-font-size10">{`${CommonUtil.__getDateDay(new Date(comment.createdAt))}, ${new Date(comment.createdAt).getFullYear()}`} - {CommonUtil.__format_AM_PM(comment.createdAt)}</div>
                    </Space>
                    <div className="cm-font-size13 cm-font-fam400 j-buyer-comment-text">{comment.comment}</div>
                </Space>
                </div>
            </div>
        );
    }

export default CommentBox