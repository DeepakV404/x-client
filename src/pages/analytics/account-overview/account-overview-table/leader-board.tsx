import { useQuery } from "@apollo/client";
import { Table, Typography } from "antd";

import { LEADER_BOARD_STATS } from "../api/analytics-query";
import SomethingWentWrong from "../../../../components/error-pages/something-went-wrong";
import Loading from "../../../../utils/loading";
import NoResultFound from "../../../../components/no-result-found";
import { EMPTY_LEADER_BOARD } from "../../../../constants/module-constants";


const { Text }  =   Typography

const LeaderBoard = (props: {from: any, to: any}) => {

    const { from, to }  =   props;

    const { data, loading, error } = useQuery(LEADER_BOARD_STATS, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from:   from,
                to  :   to
            },
            pageConstraint: {
                page: 1,
                limit: 1000
            }
        }
    });

    const renderers = {
        _name: (_name: any) => (
            <Text className="cm-font-fam500" style={{ width: "180px" }} ellipsis={{ tooltip: `${_name.seller.firstName} ${_name.seller.lastName}` }}>
                {_name.seller.firstName} {_name.seller.lastName}
            </Text>
        ),
        _regions: (record: any) => {
            const regionNames = record.regions?.map((region: any) => region.name).join(", ");
            return (
                <Text ellipsis={{ tooltip: regionNames }} style={{ width: "130px" }}>
                    {regionNames ? regionNames : "-"}
                </Text>
            );
        },
        _total_room: (totalRooms: number) => (
            <div>{totalRooms}</div>
        ),
        _win: (roomsWon: number) => (
            <div>{roomsWon}</div>
        ),
        _loss: (roomsLost: number) => (
            <div>{roomsLost}</div>
        ),
        _win_rate: (winRate: number) => (
            <div>{winRate === -1 ? "-" : `${winRate.toFixed(0)}%`}</div>
        )
    };
    
    const columns: any = [
        {
            title: 'Name',
            key: 'name',
            render: renderers._name,
            width: '200px',
            fixed: "left"
        },
        {
            title: 'Regions',
            key: 'region',
            render: renderers._regions,
            width: '150px',
        },
        {
            title: (<div style={{ whiteSpace: "nowrap" }}>Total Room</div>),
            dataIndex: 'totalRooms',
            key: 'total_room',
            render: renderers._total_room,
            width: '100px',
        },
        {
            title: 'Win',
            dataIndex: 'roomsWon',
            key: 'win',
            render: renderers._win,
            width: '100px',
        },
        {
            title: 'Loss',
            dataIndex: 'roomsLost',
            key: 'loss',
            render: renderers._loss,
            width: '100px',
        },
        {
            title: 'Win Rate',
            dataIndex: 'winRate',
            key: 'win_rate',
            render: renderers._win_rate,
            width: '100px',
        },
    ];
    
    console.log(data?.leaderboardStats)

    return (
        <div className="j-analytics-overview-card cm-padding-block10 cm-flex-direction-column" style={{rowGap: "0", height: "370px"}}>
            <Text className="cm-secondary-text cm-font-fam500 cm-padding-inline15">Leaderboard</Text> 
            {
                data?.leaderboardStats.length > 0 ?
                    <Table 
                        className       =   "cm-padding15"
                        size            =   "small"
                        pagination      =   {false}
                        columns         =   {columns} 
                        dataSource      =   {data?.leaderboardStats}
                        scroll          =   {{y: 270}}
                        locale          =   {{
                            emptyText   :   <div className='cm-flex-center' style={{height: "250px"}}>
                                                {loading || !data ? (error ? <SomethingWentWrong/> : <Loading />) : <NoResultFound message='No users found' />}
                                            </div>
                        }}
                    />
                :
                    <div className="cm-flex-center cm-height100">
                        <img src={EMPTY_LEADER_BOARD} alt="top_5_deals" width={155}/>
                    </div>
            }
        </div>
    )
}

export default LeaderBoard