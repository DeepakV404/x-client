import { useContext } from 'react';
import { Avatar, Divider, Dropdown, Menu, Space, Typography } from 'antd';

import { CommonUtil } from '../../utils/common-util';
import { GlobalContext } from '../../globals';

import MaterialSymbolsRounded from '../../components/MaterialSymbolsRounded';

const { Text }  =   Typography;

const Profile = () => {

    const { $user, $isVendorMode, $isVendorOrg }  =   useContext(GlobalContext);

    

    const getUserAvatar = (size: number) => {
        return (
            <Avatar size={size} shape='square' style = {{backgroundColor: "#ededed", color: "#000", borderRadius: "8px" }} src={$user.profileUrl ? <img src={$user.profileUrl} alt={CommonUtil.__getFullName($user.firstName, $user.lastName)}/> : ""}>
                {CommonUtil.__getAvatarName(CommonUtil.__getFullName($user.firstName, $user.lastName),1)}
            </Avatar>
        )
    }

    const ProfileActions = (
        <div className='j-header-profile-layout'>
            <div className='j-header-profile-header'>
                <Space>
                    {getUserAvatar(40)}
                    <Space direction='vertical' size={0}>
                        <Text style={{maxWidth: "190px"}} ellipsis={{tooltip: CommonUtil.__getFullName($user.firstName, $user.lastName)}} className='cm-font-fam500 cm-font14 cm-letter-spacing03'>{CommonUtil.__getFullName($user.firstName, $user.lastName)}</Text>
                        <Text style={{maxWidth: "190px"}} ellipsis={{tooltip: $user.emailId}} className=' cm-letter-spacing03'>{$user.emailId}</Text>
                    </Space>
                </Space>
            </div>
            <Menu className='j-header-profile-action' >
                <Menu.Item key={1} >
                    <a href={"#" + "/settings/personal-details"}>
                        <Space>
                            <MaterialSymbolsRounded font={"person"} filled size="18"/>
                            <div className='cm-font-size14 cm-letter-spacing03'>Profile</div>
                        </Space>
                    </a>
                </Menu.Item>

                <Menu.Item key={6} >
                    <a href={($isVendorMode || $isVendorOrg) ? "https://intercom.help/buyerstage-resources/en/collections/10923769-links" : "https://intercom.help/buyerstage-resources/en/"} target="_blank" rel="noreferrer">
                        <Space>
                            <MaterialSymbolsRounded font={"import_contacts"} filled size="18"/>
                            <div className='cm-font13 cm-letter-spacing03'>Help center</div>
                        </Space>
                    </a>
                </Menu.Item>

                <Divider />
            
                <Menu.Item key={8} >
                    <a href={`${window.location.origin}/logout`}>
                        <Space>
                            <MaterialSymbolsRounded font={"logout"} size="18"/>
                            <div className='cm-font13 cm-letter-spacing03'>Logout</div>
                        </Space>
                    </a>
                </Menu.Item>
            </Menu>
        </div>
    );

    return (
        <Dropdown 
            overlay             =   {ProfileActions}
            trigger             =   {['click']}
            overlayClassName    =   {"j-header-profile"}
            className           =   {'j-header-profile-icon cm-cursor-pointer'}
            destroyPopupOnHide
        >
            {getUserAvatar(35)}
        </Dropdown>
        
    )
}

export default Profile;