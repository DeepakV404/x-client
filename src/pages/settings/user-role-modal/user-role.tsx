import { useContext } from "react";
import { Space, Tooltip, Typography } from "antd";

import { ROLE_ADMIN, ROLE_CONTENT_EDITOR, ROLE_MANAGER, ROLE_OWNER, ROLE_PERMISSION, ROLE_USER, ROLE_VIEWER } from "../../../config/role-config";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { SettingsAgent } from "../api/settings-agent";
import { GlobalContext } from "../../../globals";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";

const { Text } = Typography

const UserRole = (props: { user: any, onClose: () => void }) => {

    const { user, onClose } = props;

    const { $isVendorMode, $isVendorOrg, $orgDetail }    =   useContext(GlobalContext);

    let remainingUser   =   $orgDetail.planDetail.remainingUsers;

    const handleRoleSelection = (_role: any) => {
        SettingsAgent.updateUserRole({
            variables: {
                userUuid: user.uuid,
                role: _role.role
            },
            onCompletion: () => {
                onClose()
            },
            errorCallBack: (error: any) => { 
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const checkRoleOrgType = (role: string) => {
        if($isVendorMode || $isVendorOrg){
            if(ROLE_PERMISSION[role].orgTypes.includes("DPR")){
                return true
            }
            else return false
        }else if(ROLE_PERMISSION[role].orgTypes.includes("DSR")){
            return true
        }
        return false
    }

    return (
        <div className="cm-width100">
            <div className="cm-padding15 cm-font-fam500 cm-font-size15" style={{ borderBottom: "1px solid #E8E8EC" }} >
                Select App Roles
            </div>
            <div className="cm-width100 cm-flex-direction-column cm-flex">
            {Object.values(ROLE_PERMISSION).map((_role: any) => {
                const isDisabled = remainingUser < 1 && ([ROLE_USER, ROLE_MANAGER, ROLE_ADMIN].includes(_role.role) && [ROLE_CONTENT_EDITOR, ROLE_VIEWER].includes(user.role));

                if (_role.role !== ROLE_OWNER && checkRoleOrgType(_role.role)) {
                    return (
                        <Tooltip title={isDisabled ? "You have reached the maximum limit of users" : ""} key={_role.role}>
                            <div
                                key         =   {_role.role}
                                className   =   {`j-user-role-selection ${isDisabled ? "cm-cursor-disabled" : "cm-cursor-pointer"} cm-flex-align-center cm-flex-space-between`}
                                style       =   {{ padding: "10px 15px" }}
                                onClick     =   {() => !isDisabled && _role.role !== user.role ? handleRoleSelection(_role) : null}
                            >
                                <Space direction="vertical" size={0} className="cm-width100">
                                    <Text className={`${isDisabled ? "cm-font-opacity-black-65" : "cm-font-opacity-black-85"} cm-width100`}>
                                        {_role.displayName}
                                    </Text>
                                    <Text className={`${isDisabled ? "cm-font-opacity-black-65" : "cm-font-opacity-black-85"} cm-font-size12 cm-flex-align-center`}>{_role.permissionsDesc}</Text>
                                </Space>
                                {_role.role === user.role && <MaterialSymbolsRounded font="done" color="#52c41a" />}
                            </div>
                        </Tooltip>
                    );
                }
                return null;
            })}

            </div>
        </div>
    )
}

export default UserRole