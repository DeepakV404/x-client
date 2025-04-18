import { useContext } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Layout, Menu, Space } from 'antd';

import { PermissionCheckers } from '../../../config/role-permission';
import { GlobalContext } from '../../../globals';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';

const { Content, Sider }   =   Layout;

const OptionsLayout = () => {

    const { $user, $isVendorMode, $isVendorOrg } = useContext(GlobalContext);

    const pathname      =   useLocation().pathname.split("/")[3];

    return (
        <div className="cm-height100">
            <div className="cm-width100 j-setting-header">
                <Space>
                    <MaterialSymbolsRounded font="category" size="22" color="#0065E5" />
                    <div className="cm-font-size16 cm-font-fam500">Options</div>
                </Space>
            </div>
            <Layout style={{ height: "calc(100% - 45px)" }}>
                <Sider width={250}>
                    <Menu
                        mode                =   "inline"
                        defaultSelectedKeys =   {[pathname]}
                        style               =   {{ height: '100%', borderInlineEnd: "1px solid #1515150f" }}
                        selectedKeys        =   {[pathname]}
                    >
                        {
                            PermissionCheckers.__checkUsecaseCategoryPermisson($user.role).read ?
                                <Menu.Item key="usecase-categories">
                                    <NavLink to={"usecase-categories"}>Use-case Categories</NavLink>
                                </Menu.Item>
                                :
                                null
                        }
                        {
                            PermissionCheckers.__checkResourceCategoryPermisson($user.role).read ?
                                <Menu.Item key="resource-categories">
                                    <NavLink to={"resource-categories"}>Resource Categories</NavLink>
                                </Menu.Item>
                            :
                                null
                        }
                        {
                            PermissionCheckers.__checkUsecaseCategoryPermisson($user.role).read ?
                                <Menu.Item key="regions">
                                    <NavLink to={"regions"}>Regions</NavLink>
                                </Menu.Item>
                            :
                                null
                        }
                        {
                            PermissionCheckers.__checkUsecaseCategoryPermisson($user.role).read && !($isVendorMode || $isVendorOrg) ?
                                <Menu.Item key="room-stages">
                                    <NavLink to={"room-stages"}>Room Stages</NavLink>
                                </Menu.Item>
                            :
                                null
                        }
                    </Menu>
                </Sider>
                <Content>
                    <Outlet/>
                </Content>
            </Layout>
        </div>
    )
}

export default OptionsLayout