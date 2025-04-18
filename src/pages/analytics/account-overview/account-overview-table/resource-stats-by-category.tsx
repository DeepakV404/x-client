import { useQuery } from "@apollo/client";
import { Table, Typography } from "antd";

import { RESOURCE_STATS_BY_CATEGORY } from "../api/analytics-query";
import { CommonUtil } from "../../../../utils/common-util";
import SomethingWentWrong from "../../../../components/error-pages/something-went-wrong";
import Loading from "../../../../utils/loading";
import NoResultFound from "../../../../components/no-result-found";

const { Text }    =   Typography

const ResourceStatsByCategory = (props: {from: any, to: any}) => {

    const { from, to }  =   props;

    const { data, loading, error } = useQuery(RESOURCE_STATS_BY_CATEGORY, {
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
        _category: (item: any) => (
            <div className="cm-font-fam500">{item.category?.name || 'Uncategorized'}</div>                ),
        _time_spent: (timeSpent: number) => (
            <div>{CommonUtil.__getFormatDuration(timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ") || "-"}</div>
        ),
        _views: (views: number) => (
            <div>{views}</div>
        ),
    };

    const columns = [
        {
            title     : 'Category',
            key       : 'category',
            render    : renderers._category,
            width     : "50%"
        },
        {
            title     : 'Time Spent',
            key       : 'time_spent',
            dataIndex : 'timeSpent',
            render    : renderers._time_spent,
        },
        {
            title     : 'Views',
            key       : 'views',
            dataIndex : 'views',
            render    : renderers._views,
        },
    ]

    if(error) return <SomethingWentWrong />

    return (
        <div className="j-analytics-overview-card cm-padding-block10 cm-flex-direction-column" style={{rowGap: "0", height: "370px"}}>
            <Text className="cm-secondary-text cm-padding-inline15 cm-font-fam500">Top Performing Categories</Text>
            {
                loading 
                ? 
                    <Loading />
                :
                    <Table 
                        className       =   "cm-padding15"
                        size            =   "small"
                        pagination      =   {false}
                        columns         =   {columns} 
                        dataSource      =   {data?.resourceStatsByCategory?.filter((item: any) => item.views > 0)}
                        scroll          =   {{y: 270}}
                        locale          =   {{
                            emptyText   :   <div className='cm-flex-center' style={{height: "250px"}}>
                                                {loading || !data ? (error ? <SomethingWentWrong/> : <Loading />) : <NoResultFound message='No categories found' />}
                                            </div>
                        }}
                    />
            }
        </div>
    )
}

export default ResourceStatsByCategory