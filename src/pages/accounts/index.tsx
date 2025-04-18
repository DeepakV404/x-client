import { useContext, useState } from 'react';
import { Outlet, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Button, Col, Radio, Row, Typography } from 'antd';

import { SIMPLE_ACCOUNT } from './api/accounts-query';

import SomethingWentWrong from '../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../components/MaterialSymbolsRounded';
import RoomModal from '../rooms/create-room/room-modal';
import Loading from '../../utils/loading';
import { checkPermission } from '../../config/role-permission';
import { FEATURE_ROOMS } from '../../config/role-permission-config';
import { GlobalContext } from '../../globals';

const { Text }  =   Typography;

export function useAccountContext() {
    return useOutletContext<any>();
}

const AccountsLayout = () => {

    const params    =   useParams();
    const navigate  =   useNavigate();
    const location  =   useLocation();

    const { $user, $dictionary, $isVendorMode, $isVendorOrg } =   useContext(GlobalContext);
    
    const [showModal, setShowModal]     =   useState(false);

    const { data, loading, error }      =   useQuery(SIMPLE_ACCOUNT, {
        variables: {
            accountUuid :   params.accountId
        },
        fetchPolicy: "network-only"
    });

    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong/>

    return (
        <>
            <Row className='cm-flex-space-between j-module-listing-header cm-flex-align-center'>
                <Col span={8} className="cm-flex-align-center">
                    <MaterialSymbolsRounded font="arrow_back" className="cm-cursor-pointer cm-margin-right5" onClick={() => navigate("/accounts")} color="#454545" size="22"/>
                    <Text className='cm-font-fam500 cm-font-size18' style={{maxWidth: "100%"}} ellipsis={{tooltip: data.simpleAccount.companyName}}>{data.simpleAccount.companyName}</Text>
                </Col>
                <Col span={8} className="cm-flex-center">
                    <Radio.Group defaultValue={location.pathname.split("/")[3] === "edit" ? "edit" : "view"} buttonStyle="solid" className="cm-flex j-flat-radio-grp" onChange={(event) => navigate(event.target.value === "edit" ? event.target.value : "")}>
                        <Radio.Button value={"view"} className='cm-font-fam500'>
                            All {$dictionary.rooms.title}
                        </Radio.Button>
                        <Radio.Button value={"edit"} className='cm-font-fam500'>
                            Account Details
                        </Radio.Button>
                    </Radio.Group>
                </Col>
                <Col span={8} className="cm-flex-justify-end">
                    { checkPermission($user.role, FEATURE_ROOMS, 'create') && !($isVendorMode || $isVendorOrg) && <Button className='cm-flex-center cm-icon-button' type="primary" onClick={() => setShowModal(true)} icon={<MaterialSymbolsRounded font="add" size="20"/>}>New {$dictionary.rooms.singularTitle}</Button>}
                </Col>
            </Row>
            <div className='j-module-listing-body'>
                <Outlet context={{"account": data.simpleAccount}}/>
            </div>
            <RoomModal
                isOpen      =   {showModal}
                onClose     =   {() => setShowModal(false)}
                accountId   =   {params.accountId}
            />
        </>
    )
}

export default AccountsLayout