import { Avatar, Badge, Button, Space, Tooltip, message } from 'antd';

import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';
import { BuyerAgent } from '../../api/buyer-agent';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import useLocalization from '../../../custom-hooks/use-translation-hook';
import Translate from '../../../components/Translate';

const YourPeople = (props: {seller: any}) => {

    const { seller }    =   props;

    const { translate } =   useLocalization();

    const getStatus = (status: string) => {
        if(status === "ACTIVE"){
            return  <Space><Badge status="success" /><div className='cm-font-size12'><Translate i18nKey='common-labels.active'/></div></Space>
        }else if(status === "IN_ACTIVE"){
            return <Space><Badge status="warning" /><div className='cm-font-size12'><Translate i18nKey='common-labels.inactive'/></div></Space>
        }
    }

    const handleResend = (uuid: string) => {
        const messageLoading = message.loading(translate("invite-form.sending-invite"), 0)
        BuyerAgent.resendBuyerInvite({
            variables: {
                buyerUuid   :   uuid  
            },
            onCompletion: () => {
                messageLoading()
                CommonUtil.__showSuccess(translate("success-message.invitation-sent-message"))
            },
            errorCallBack: (error: any) => {
                messageLoading()
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error) 
            }
        })
    }

    return (
        <Space className='cm-flex-space-between cm-width100'>
            <Space>
                <Tooltip title={CommonUtil.__getFullName(seller.firstName, seller.lastName)} placement="bottom">
                    <Avatar shape='square' size={40} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "14px", display: "flex", alignItems: "center", border: seller.isOwner ? "2px solid #fe8529" : ""}} src={seller.profileUrl ? <img src={seller.profileUrl} alt={CommonUtil.__getFullName(seller.firstName, seller.lastName)}/> : ""}>
                        {CommonUtil.__getAvatarName(CommonUtil.__getFullName(seller.firstName, seller.lastName), 1)}
                    </Avatar>
                </Tooltip>
                <Space direction='vertical' size={0}>
                    <div className='cm-font-fam500'>{CommonUtil.__getFullName(seller.firstName, seller.lastName)}</div>
                    <div className='cm-font-size12'>{seller.emailId}</div>
                </Space>
            </Space>
            <Space>
                <Space size={20}>
                    {getStatus(seller.status)}
                </Space>
                {
                    seller.status === "INVITED" &&
                        <div className='cm-flex-align-center'>
                            <Button ghost size='small' type='primary' className='cm-font-size12' style={{lineHeight: "normal"}} onClick={() => handleResend(seller.uuid)}>
                                <MaterialSymbolsRounded font='forward' size='18'/>
                                <Translate i18nKey='common-labels.re-invite'/>
                            </Button>
                        </div>
                }
            </Space>
        </Space>
    )
}

export default YourPeople