import { useContext, useEffect, useState } from 'react';
import { Badge, Button, Input, Select, Space, Tabs } from 'antd';
import { useQuery } from '@apollo/client';
import { debounce } from 'lodash';

import { GlobalContext } from '../../../globals';
import { GET_TOTAL_ROOMS } from '../api/rooms-query';
import { checkPermission } from '../../../config/role-permission';
import { FEATURE_ROOMS } from '../../../config/role-permission-config';
import { SIMPLE_ROOM_TEMPLATES } from '../../templates/api/room-templates-query';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import LeadRoomModal from '../lead-room/lead-room-modal';
import RoomFilterDrawer from './room-filter-drawer';
import RoomsTable from './rooms-table';
import LockedButton from '../../settings/pricing/locked-button';
import { ACCOUNT_TYPE_DPR } from '../../../constants/module-constants';
import CreateRoom from '../create-room/new-flow';

const { Option }    =   Select;

const RoomsListing = () => {

    const { $user, $isVendorOrg, $isVendorMode, $dictionary, $orgDetail, $limits, $entityCount, $accountType}    =   useContext(GlobalContext);

    const { data: allRoomsCount } = useQuery(GET_TOTAL_ROOMS, {
        fetchPolicy: "network-only"
    });

    const { data: myRoomsCount } = useQuery(GET_TOTAL_ROOMS, {
        variables: {filter: {myRooms: true}},
        fetchPolicy: "network-only"
    });

    const { data: rtData, loading: rtLoading }      =   useQuery(SIMPLE_ROOM_TEMPLATES, {
        fetchPolicy: "network-only",
        skip: !($isVendorMode || $isVendorOrg)
    })

    const [searchKey, setSearchKey]                         =   useState("");
    const [showModal, setShowModal]                         =   useState(false);
    const [dataFilter, setDataFilter]                       =   useState($accountType !== ACCOUNT_TYPE_DPR ? 'my_rooms' : 'all_rooms');
    const [filteredAllRoomsCount, setFilteredAllRoomsCount] =   useState(0);
    const [filteredMyRoomsCount, setFilteredMyRoomsCount]   =   useState(0);
    const [isFilterOpen, setIsFilterOpen]                   =   useState(false);
    const [roomFilter, setRoomFilter]                       =   useState<any>({});
    const [createLeadRoom, setCreateLeadRoom]               =   useState(false);
    const [templateFilter, setTemplateFilter]               =   useState<string[]>([]);

    const handleSearch = debounce((event: any) => {
        setSearchKey(event.target.value)
    }, 1000);

    const items = [
        $accountType !== ACCOUNT_TYPE_DPR &&
        {
            key         :   'my_rooms',
            label       :   `My ${$dictionary.rooms.title} (${filteredMyRoomsCount})`
        },
        {
            key         :   'all_rooms',
            label       :   `All ${$dictionary.rooms.title} (${filteredAllRoomsCount})`
        }
    ];

    useEffect(() => {
        if (allRoomsCount) {
            setFilteredAllRoomsCount(allRoomsCount.getTotalRooms)
        }
    }, [allRoomsCount])

    useEffect(() => {
        if (myRoomsCount) {
            setFilteredMyRoomsCount(myRoomsCount.getTotalRooms)
        }
    }, [myRoomsCount])

    useEffect(() => {
        const hash = window.location.hash;
        const hashParams = new URLSearchParams(hash.split('?')[1]);
        
        const templateIds = hashParams.get('template')?.split(',') || [];
        
        if (templateIds.length > 0) {
            setTemplateFilter(templateIds);
            setRoomFilter((prevFilter: any) => ({ ...prevFilter, template: templateIds }));
        }
    },[window.location])

    const resetFilter = () => {
        setRoomFilter({})
        setTemplateFilter([]);
        const filterUrl = `${$orgDetail.tenantName}#/rooms`;
        window.history.pushState({}, '', filterUrl);
    }

    const isFilterApplied = () => {
        return Object.values(roomFilter).some((_item: any) => _item !== undefined)
    }

    const applyPodFilter = (templateIds: string[]) => {
        const queryParams = new URLSearchParams();

        if (templateIds.length > 0) {
            const templateParam = templateIds.join(',');
            queryParams.append('template', templateParam);
        }

        const filterUrl = `${$orgDetail.tenantName}#/rooms?${queryParams.toString()}`;
        window.history.pushState({}, '', filterUrl);

        setTemplateFilter(templateIds);
        setRoomFilter((prevFilter: any) => ({ ...prevFilter, template: templateIds }));
    }
    
    const checkRoomsLimit = () => {
        if($limits && $limits.roomLimit && parseInt($limits.roomLimit) !== -1){
            if($entityCount.roomsCount >= parseInt($limits.roomLimit)){
                return false
            }else{
                return true
            }
        }else return true
    }

    const handleTabChange = (key: string) => {
        if (key === 'all_rooms') {
            setDataFilter("all_rooms");
        } else {
            setDataFilter("my_rooms");
        }
    };

    return (
        <>
            <Space className='cm-flex-space-between j-module-listing-header cm-flex-align-center'>
                <Space>
                <Tabs
                    className   =   'j-links-tab'
                    items       =   {items.filter(Boolean).map((item: any) => ({
                        key: item.key,
                        label: item.label,
                        onClick: item.onClick, 
                    }))}
                    onChange    =   {handleTabChange}
                    defaultActiveKey    =   {$accountType === ACCOUNT_TYPE_DPR ? 'all_rooms' : 'my_rooms'}
                />

                    {
                        ($isVendorMode || $isVendorOrg) ?
                            <>
                                <div className='cm-flex cm-margin-left15'>
                                    <div className='j-pods-select-prefix'>
                                        {$dictionary.templates.title}
                                    </div>
                                    <Select
                                        showSearch
                                        loading             =   {rtLoading}
                                        disabled            =   {rtLoading}
                                        optionFilterProp    =   'filter'
                                        optionLabelProp     =   "label"
                                        placeholder         =   "Choose"
                                        mode                =   "multiple"
                                        value               =   {templateFilter}
                                        listHeight          =   {150}
                                        style               =   {{width: "200px"}}
                                        className           =   'j-pods-select'    
                                        dropdownStyle       =   {{width: "255px"}}
                                        placement           =   'bottomRight'
                                        maxTagCount         =   {"responsive"}
                                        onChange            =   {(templateIds: string[]) => applyPodFilter(templateIds)}
                                        notFoundContent     =   {
                                            <div style={{height:"50px"}} className='cm-flex-center'>
                                                <div className='cm-empty-text cm-font-size12'>No {$dictionary.templates.title} found</div>
                                            </div>
                                        }
                                        suffixIcon          =   {<MaterialSymbolsRounded font='expand_more' size='20' color='#000' weight='400'/>}
                                    >
                                        {rtData && rtData.roomTemplates.map((_template: any) => (
                                            <Option value={_template.uuid} label = {<div className="cm-font-fam500 cm-font-size14">{_template.title}</div>}>
                                                <Space direction="vertical" size={2}>
                                                    <div className="cm-font-fam500 cm-font-size13">{_template.title}</div>
                                                    {
                                                        _template.description ?
                                                            <div className="cm-font-fam300 cm-font-size12">{_template.description}</div>
                                                        :
                                                            <div className="cm-font-fam300 cm-font-size12 cm-empty-text">No description found</div>
                                                    }
                                                </Space>
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                                {
                                    templateFilter.length > 0 &&
                                        <Button type='link' className="cm-margin0 cm-cursor-pointer" onClick={() => {resetFilter()}}>
                                            Reset
                                        </Button>
                                }
                            </>
                        :
                            null
                    }
                </Space>
                <Space size={10} className='cm-flex'>
                    <Space>
                        <div className='cm-flex-justify-end'>
                            <Input placeholder="Search" prefix={<MaterialSymbolsRounded font="search" size="18" color="#c1c1c1" />} allowClear style={{ width: "230px" }} onChange={handleSearch} />
                        </div>
                        <Badge className='cm-flex' dot={isFilterApplied()}>
                            <div onClick={(event) => { event.stopPropagation(); setIsFilterOpen(true) }} className='j-template-header-icon-wrapper cm-cursor-pointer'>
                                <MaterialSymbolsRounded font="tune" size="22" className='cm-secondary-text' />
                            </div>
                        </Badge>
                        {
                            $accountType !== ACCOUNT_TYPE_DPR && (
                                checkRoomsLimit() ?
                                    checkPermission($user.role, FEATURE_ROOMS, 'create') && 
                                            <Button icon={<MaterialSymbolsRounded font="add" size="20" weight='400' />} className='cm-flex-align-center cm-icon-button' type="primary" onClick={() => ($isVendorMode || $isVendorOrg) ? setCreateLeadRoom(true) : setShowModal(true)}>
                                                Create {$dictionary.rooms.singularTitle}
                                            </Button>
                                :
                                    <LockedButton btnText={`Create ${$dictionary.rooms.singularTitle}`}/>
                            )
                        }
                    </Space>
                </Space>
            </Space>

            <RoomsTable 
                searchKey               =   {searchKey} 
                setShowModal            =   {setShowModal} 
                setCreateLeadRoom       =   {setCreateLeadRoom} 
                dataFilter              =   {dataFilter} 
                setFilteredAllRoomsCount=   {setFilteredAllRoomsCount} 
                setFilteredMyRoomsCount =   {setFilteredMyRoomsCount}
                roomsCount              =   {filteredAllRoomsCount} 
                roomFilter              =   {roomFilter} 
            />

            <RoomFilterDrawer
                isOpen={isFilterOpen}
                onClose={() => { setIsFilterOpen(false) }}
                initialFilter={roomFilter}
                setFilter={setRoomFilter}
                resetFilter={resetFilter}
                isFilterApplied={isFilterApplied}
            />
            <CreateRoom
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
            <LeadRoomModal
                isOpen     =   {createLeadRoom}
                onClose    =   {() => setCreateLeadRoom(false)}
            />
        </>
    );
};

export default RoomsListing;
