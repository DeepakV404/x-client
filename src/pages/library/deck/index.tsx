import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery, useQuery } from '@apollo/client';
import { debounce } from 'lodash';
import { Avatar, Button, Divider, Dropdown, Input, Space, Switch, Table, Tabs, Tag, Tooltip, Typography } from 'antd';

import { EMPTY_CONTENT_ACCOUNT_IMG, Length_Input, WIDGET_PROFILE_IMAGE_FALLBACK } from '../../../constants/module-constants';
import { PermissionCheckers } from '../../../config/role-permission';
import { FEATURE_DECK } from '../../../config/role-permission-config';
import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';
import { D_TAGS, DECKS, DECKS_COUNT } from '../api/library-query';
import { LibraryAgent } from '../api/library-agent';
import { GlobalContext } from '../../../globals';
import Tags, { TagProp } from './tags';

import DeleteConfirmation from '../../../components/confirmation/delete-confirmation';
import SomethingWentWrong from '../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import CreateDeckSlider from './create-deck/create-deck-slider';
import LockedButton from '../../settings/pricing/locked-button';
import CopyLinkModal from './modal/copy-link/copy-link-modal';
import Loading from '../../../utils/loading';

const { Text }      =   Typography;

interface TagItem {
    name        : string;
    uuid        : string;
    properties  : {
        colorCode: string;
    };
}

const Decks = () => {

    const navigate      =   useNavigate();

    const { $user, $limits, $entityCount }        =   useContext(GlobalContext);

    const createDeckPermission     =    PermissionCheckers.__checkPermission($user.role, FEATURE_DECK, 'create');
    const EditDeckPermission       =    PermissionCheckers.__checkPermission($user.role, FEATURE_DECK, 'update');

    const [decksFilter, setDecksFilter]                 =   useState({
        myDecks     : true,
    });
    const [deleteModal, setDeleteModal]                 =   useState({
        uuid    :   null,
        isOpen  :   false
    });
    const [linkCopyModal, setLinkCopyModal]             =   useState({
        visibility  :   false,
        link        :   "",
        openedIn    :   "product"
    })
    const [showCreateDeck, setShowCreateDeck]           =   useState<any>({
        visibility          :   false,
        action              :   "Create"
    });

    const [_getDecks, { data, loading, error }]             = useLazyQuery(DECKS, {fetchPolicy: "network-only"});
    const { data: myDecks, loading: myDeckLoading }         = useQuery(DECKS_COUNT, {fetchPolicy: "network-only", variables: {filter: {myDecks: true}}});
    const { data: allDecks, loading: allDeckLoading }       = useQuery(DECKS_COUNT, {fetchPolicy: "network-only", variables: {filter: {myDecks: false}}});
    const { data: tagsData, error: tagsError }              = useQuery(D_TAGS, {
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        _getDecks({
            variables: {
                filter : decksFilter
            }
        })
    }, [decksFilter])

    const debouncedSetSearchKey = useCallback(
        debounce((value) => {
            setDecksFilter((prev: any) => ({ ...prev, searchKey: value }));
        }, 500),[]
    );

    const handleDebounceSearch = (e: any) => {
        debouncedSetSearchKey(e.target.value);
    };

    const handleChange = (_: any, filters: any) => {
        setDecksFilter((prev: any) => ({ ...prev, tagUuids: filters.tags }));
    }

    const handleDeckClick = (e:any, deck: any) => {
        if(e.metaKey || e.ctrlKey) {
            window.open(window.location.href + "/" + deck.uuid, "_blank")
            return
        }
        navigate(deck.uuid)
    }

    const handleDeleteDeck = () => {
        LibraryAgent.deleteDeck({
            variables: {
                deckUuid    :   deleteModal.uuid
            },
            onCompletion: () => {
                setDeleteModal({uuid: null, isOpen: false})
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleOnCreateDeckClick = () => {
        setShowCreateDeck({
            visibility  :   true,
            action      :   "Create"
        })
    }

    const handleDeckExpiryChange = (state: boolean, id: string) => {                
        LibraryAgent.updateDeck({
            variables: {
                deckUuid: id,
                input   :   {
                    enableLink : state
                }
            },
            refetch         :   false,
            onCompletion: () => {
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const items = (_deck: any) => {
        return([
            {
                key     :   'delete',
                icon    :   <MaterialSymbolsRounded font="delete" size="16"/>,
                label   :   (
                    <span>Delete</span>
                ),
                onClick :   () => {
                    setDeleteModal({uuid: _deck.uuid, isOpen: true})
                },
                danger  :   true
            },
        ])
    }

    const renderers = {
        "_title"  :   (_: any, _deck: any) => {            
            return (
                <Text className='cm-font-fam500' ellipsis={{tooltip: _deck.title}} style={{maxWidth: "100%"}}>{_deck.title}</Text>
            )
        },
        // "_viewedBy" :   (_:any, _deck: any) => {
        //     return (
        //         <Space size={30}>
        //             <Space size={2}><MaterialSymbolsRounded font='account_circle' size='22'color='#5F6368'/> <Text className="cm-font-opacity-black-85 cm-font-fam500">{_deck.contactCount}</Text></Space>
        //             <Space size={2}><MaterialSymbolsRounded font='no_accounts' size='22'color='#5F6368'/> <Text className="cm-font-opacity-black-85 cm-font-fam500">{_deck.anonymousCount}</Text></Space>
        //         </Space>
        //     )
        // },
        "_resourcesCount" :   (_:any, _deck: any) => {
            return (
                <Space>
                    <MaterialSymbolsRounded font='attachment' size='20'color='#5F6368'/>
                    <div className='cm-font-opacity-black-85 cm-font-fam500'>{_deck.resourcesCount < 10 ? "0" : null}{_deck.resourcesCount}</div>
                </Space>
            )
        },
        "_createdBy": (_: any, _deck: any) => {
            return(
                <Space>
                    <Avatar size={25} src={_deck?.createdBy?.profileUrl ? _deck.createdBy.profileUrl : WIDGET_PROFILE_IMAGE_FALLBACK}/>
                    <Divider type='vertical' className='cm-margin0' style={{top: "0px"}}/>
                    <Text style={{opacity: "67%"}}>{CommonUtil.__getDateDayYear(_deck.createdAt)}</Text>
                </Space>
            )
        },
        "_previewLink" : (_: any, _deck: any) => {
            const handleButtonClick = () => {
                if(CommonUtil.__getSubdomain(window.location.origin) === "hs-app" || CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app"){
                    setLinkCopyModal({
                        visibility: true, 
                        link: _deck.copyLink, 
                        openedIn: "crm"
                    })
                }else{
                    setLinkCopyModal({
                        visibility: true,
                        link: _deck.copyLink,
                        openedIn: "product"
                    })
                }
            };
              
            return (
                <Space onClick={(event: any) => event.stopPropagation()} size={20}>
                    {
                        EditDeckPermission ?
                            <Button onClick={() => handleButtonClick()}>
                                <Space size={4}>
                                    <MaterialSymbolsRounded font='link' size='20'/>
                                    Copy Link
                                </Space>
                            </Button>
                        :
                            null
                    }
                    <Button onClick={(event) => {event.stopPropagation(); window.open(_deck.previewLink,"_blank")}} style={{padding: "5px"}}><MaterialSymbolsRounded font='visibility' size='20'/></Button>
                    <Tooltip title="Link Accessibility">
                        <Switch size='small' defaultValue={_deck.isDeckEnabled} onChange={(checked: boolean) => handleDeckExpiryChange(checked, _deck.uuid)}/>
                    </Tooltip>
                    {
                       EditDeckPermission && 
                            <Dropdown menu={{items: items(_deck)}} trigger={["click"]} destroyPopupOnHide>    
                                <div onClick={(event) => event.stopPropagation()} className="cm-cursor-pointer">
                                    <MaterialSymbolsRounded font="more_vert" size="22" className='cm-secondary-text'/>
                                </div>
                            </Dropdown>
                    }
                </Space>
            )
        },
        "_tags" : (_: any, _deck: any) => {
            if(_deck.tags.length > 0){
                return(
                    <Tags deckId={_deck.uuid}  mappedTags={_deck.tags ?? []} tagsData={tagsData} tagsError={tagsError}>
                        <div className='cm-padding-inline10 cm-flex cm-padding-block10' onClick={(event: React.MouseEvent<HTMLElement>) => event.stopPropagation()}>
                            {
                                _deck.tags.map((_tag: TagProp) => (
                                    <Tag className='j-deck-tag' key={_tag.uuid} color={_tag?.properties?.colorCode ?? "default"}>
                                        <Space className='cm-flex' size={4}>
                                            {_tag.name}
                                        </Space>
                                    </Tag>
                                ))
                            }
                        </div>
                    </Tags>
                )
            }else{
                return(
                    <Tags deckId={_deck.uuid}  mappedTags={_deck.tags ?? []} tagsData={tagsData} tagsError={tagsError}>
                        <Space onClick={(event: React.MouseEvent<HTMLElement>) => event.stopPropagation()} className='cm-padding-inline10 cm-light-text cm-flex-align-center cm-font-size12 cm-scrollbar-none' size={4} style={{paddingBlock: "12px"}}>
                            Add Tags
                        </Space>
                    </Tags>
                )
            }
        }
    }

    const columns: any = [
        {
            title       :   <div className='cm-font-fam500'>Name</div>,
            key         :   'title',
            render      :   renderers._title,
            width       :   "275px"
        },
        {
            title       :   <div className='cm-font-fam500 cm-padding-inline10'>Tags</div>,
            key         :   'tags',
            render      :   renderers._tags,
            width       :   "275px",
            filterIcon  :   <MaterialSymbolsRounded font='filter_list' size='18'/>,
            filters     :   tagsData?._dTags?.map((tag: TagItem) => ({
                text    :   <Tag color={tag.properties.colorCode}>{tag.name}</Tag>,
                value   :   tag.uuid
            })) ?? [],
            className   :   "j-decks-tags-cell"
        },
        // {
        //     title       :   <div className='cm-font-fam500'>Viewed By</div>,
        //     key         :   'viewedBy',
        //     render      :   renderers._viewedBy,
        //     width       :   '150px',
        // },
        {
            title       :   <div className='cm-font-fam500'>No.of Resource(s)</div>,
            key         :   'resourcesCount',
            render      :   renderers._resourcesCount,
            width       :   '175px',
        },
        {
            title       :   <div className='cm-font-fam500'>Created By & On</div>,
            key         :   'createdBy',
            render      :   renderers._createdBy,
            width       :   "250px"
        },
        {
            title       :   <div className='cm-font-fam500'>Actions</div>,
            key         :   'previewLink',
            render      :   renderers._previewLink,
            width       :   "260px"
        },
    ];

    const filterItems: any = [
        {
            key: 'myLinks',
            label: (
                <span>
                  My Links{" "}
                  {data?.decks !== undefined &&
                    (decksFilter.myDecks === true && !myDeckLoading
                      ? `(${data.decks.length})`
                      : `(${myDecks?.decks.length})`)}
                </span>
            ),
        },
        {
            key: 'allLinks',
            label: (
                <span>
                  All Links{" "}
                  {data?.decks !== undefined &&
                    (decksFilter.myDecks === false && !allDeckLoading
                      ? `(${data.decks.length})`
                      : `(${allDecks?.decks.length})`)}
                </span>
            ),
        },
    ];

    const handleTabChange = (key: string) => {
        if (key === 'myLinks') {
            setDecksFilter((prev: any) => ({ ...prev, myDecks: true }));
        } else {
            setDecksFilter((prev: any) => ({ ...prev, myDecks: false }));
        }
    };

    const checkLinkLimit = () => {
        if($limits && $limits.linkLimit && parseInt($limits.linkLimit) !== -1){
            if($entityCount.linksCount >= parseInt($limits.linkLimit)){
                return false
            }else{
                return true
            }
        }else return true
    }

    if(error) return <SomethingWentWrong />

    return (
        <>
            <div className="j-module-listing-header cm-flex-space-between cm-flex-align-center cm-padding-inline15">
                <Tabs
                    className='j-links-tab'
                    items={filterItems.map((item: any) => ({
                        key: item.key,
                        label: item.label,
                        onClick: item.onClick, 
                    }))}
                    onChange={handleTabChange}
                />
                <Space className="cm-flex-justify-center">
                    <Input allowClear autoFocus maxLength={Length_Input} placeholder={`${"Search Link"}`} className="j-library-search" suffix={<MaterialSymbolsRounded font="search" size="18"/>} onChange={handleDebounceSearch}/>
                    {
                        createDeckPermission &&
                            checkLinkLimit() ?
                                <Button icon={<MaterialSymbolsRounded font="add" size="20" weight='400'/>} className='cm-flex-align-center cm-icon-button' type="primary" onClick={handleOnCreateDeckClick}>
                                    Create Link
                                </Button>
                            :
                                <LockedButton btnText='Create Link'/>
                    }
                </Space>
            </div>
 
            <div className='j-module-listing-body cm-padding15'>
                <Table
                    size            =   'small'
                    bordered        =   {true}
                    className       =   'j-deck-listing-table'
                    style           =   {{height: "calc(100% - 50px)"}}
                    rowClassName    =   {"cm-cursor-pointer"}
                    columns         =   {columns}
                    pagination      =   {false}
                    dataSource      =   {data?.decks}
                    onChange        =   {handleChange}
                    scroll          =   {{ y: (window.innerHeight - 180) }}
                    onRow           =   {(record: any) => (
                        {
                            onClick     :   (e) => handleDeckClick(e, record),
                        }
                    )}
                    locale          =   {{
                        emptyText   :   (
                                            <div className='cm-flex-center' style={{ height: "calc(100vh - 205px)", width: "calc(100vw - 40px)" }}>
                                                {(loading) 
                                                    ? 
                                                        <Loading /> 
                                                    : 
                                                        !data?.decks.length && <div className='cm-flex-center cm-width100'>
                                                            <Space size={15} direction='vertical' className='cm-flex-center cm-height100'>
                                                                <img height={200} width={200} src={EMPTY_CONTENT_ACCOUNT_IMG} alt="" />
                                                                <Space direction='vertical' className='cm-flex-align-center' size={0}>
                                                                    <Text className='cm-font-size18'>No Links Found!</Text>
                                                                    {createDeckPermission && <Text className='cm-light-text'>We couldn't find any existing links. You can create a new one to get started.</Text>}
                                                                </Space>
                                                                {
                                                                    checkLinkLimit() ?
                                                                        (createDeckPermission && <Button icon={<MaterialSymbolsRounded font="add" size="20" weight='400' />} className='cm-flex-align-center cm-icon-button' type="primary" onClick={handleOnCreateDeckClick}>Create Link</Button>)
                                                                    :
                                                                        <LockedButton btnText='Create Link'/>
                                                                }
                                                            </Space>
                                                        </div>
                                                }
                                            </div>
                                        )
                    }}
                />
            </div>
            <DeleteConfirmation
                isOpen      =   {deleteModal.isOpen}
                onOk        =   {() => {handleDeleteDeck()}}
                onCancel    =   {() => setDeleteModal({uuid: null, isOpen: false})}
                header      =   'Delete Link'
                body        =   'Are you sure you want to delete this link?'
            />
            <CreateDeckSlider
                isOpen              =   {showCreateDeck.visibility}
                onClose             =   {() => setShowCreateDeck({visibility: false, action : null})}
                action              =   {showCreateDeck.action}
            />
            <CopyLinkModal
                isInProduct =   {linkCopyModal.openedIn === "product"}
                isOpen      =   {linkCopyModal.visibility}
                onClose     =   {() => setLinkCopyModal({visibility: false, link: "", openedIn: "product"})}
                link        =   {linkCopyModal.link}
            />
        </>
    )
}

export default Decks