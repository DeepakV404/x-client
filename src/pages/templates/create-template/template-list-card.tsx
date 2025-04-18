import { Avatar, Space, Typography, Tooltip, Popconfirm, theme} from 'antd';

import { BUYERSTAGE_PRODUCT_LOGO } from '../../../constants/module-constants';
import { RoomTemplateAgent } from '../api/room-template-agent';
import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';
import { useNavigate } from 'react-router-dom';

const { Text }  =   Typography;

const TemplateListCard = (props: { template: any, isFromScratch: boolean, onClose(): void }) => {

    const { token: { colorPrimary } }       =   theme.useToken();

    const { template, isFromScratch, onClose } =   props;

    const navigate  =   useNavigate();

    const cloneTemplate = () => {
        RoomTemplateAgent.cloneTemplateFromExisting({
            variables: {
                templateUuid : template.uuid
            },
            onCompletion: (data: any) => {
                navigate(`/templates/${data.cloneRoomTemplate.uuid}`)
                CommonUtil.__showSuccess("Template cloned successfully");
                onClose();
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)

            }
        })
    }
    
    return (
        <>
        {
            isFromScratch
            ?
                <Popconfirm 
                    placement           =   "right"  
                    title               =   {<div className="cm-font-fam500">Clone template</div>}
                    description         =   {<div className="cm-font-size13">Are you sure you want to clone this template?</div>}
                    icon                =   {null}
                    okText              =   "Clone"
                    okButtonProps       =   {{ style: {backgroundColor: `${colorPrimary}`, fontSize: "12px"}}}
                    cancelButtonProps   =   {{ danger: true, style: {color: "black", borderColor: "#E8E8EC", fontSize: "12px"}, ghost: true}}
                    onConfirm           =   {() => cloneTemplate()}
                >
                    <Space className={`j-template-modal-card cm-flex-space-between cm-margin-bottom5`}>
                        <Space>
                            <Avatar className='j-template-list-avatar' shape="square" size={32} style={{backgroundColor: "#fff", borderRadius: "7px"}} src={template?.sellerAccount?.logoUrl ? template?.sellerAccount?.logoUrl : BUYERSTAGE_PRODUCT_LOGO}>
                                {CommonUtil.__getAvatarName(template?.title, 2)}
                            </Avatar>
                            <Tooltip title={template.description ? template.description : "No description found"} mouseEnterDelay={.5}>
                                <Text className="cm-font-fam500" style={{maxWidth: "250px"}} ellipsis >
                                    {template?.title}
                                </Text>
                            </Tooltip>
                        </Space>
                    </Space>
                </Popconfirm>
            :
                <Space className={`j-template-modal-card cm-flex-space-between cm-margin-bottom5`}>
                    <Space>
                        <Avatar className='j-template-list-avatar' shape="square" size={32} style={{backgroundColor: "#fff", borderRadius: "7px"}} src={template?.sellerAccount?.logoUrl ? template?.sellerAccount?.logoUrl : BUYERSTAGE_PRODUCT_LOGO}>
                            {CommonUtil.__getAvatarName(template?.title, 2)}
                        </Avatar>
                        <Tooltip title={template.description ? template.description : "No description found"} mouseEnterDelay={.5}>
                            <Text className="cm-font-fam500" style={{maxWidth: "250px"}} ellipsis >
                                {template?.title}
                            </Text>
                        </Tooltip>
                    </Space>
                </Space>
            }
        </>
    )
}

export default TemplateListCard