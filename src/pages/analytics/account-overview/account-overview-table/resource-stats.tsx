import { useQuery } from "@apollo/client";
import { Table, Typography } from "antd";

import { RESOURCE_STATS } from "../api/analytics-query";
import { useBuyerResourceViewer } from "../../../../custom-hooks/resource-viewer-hook";
import { FALL_BACK_RESOURCE } from "../../../../constants/module-constants";
import { CommonUtil } from "../../../../utils/common-util";
import SomethingWentWrong from "../../../../components/error-pages/something-went-wrong";
import SellerResourceViewerModal from "../../../resource-viewer/seller-resource-viewer-modal";
import Loading from "../../../../utils/loading";
import NoResultFound from "../../../../components/no-result-found";


const { Text }  =   Typography;

const ResourceStats = (props: {from: any, to: any}) => {

    const { from, to }  =   props;

    const { viewResourceProp, handleResourceOnClick }   =   useBuyerResourceViewer();

    const { data, loading, error } = useQuery(RESOURCE_STATS, {
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
        _content: (item: any) => (
            <div className="cm-flex-align-center cm-gap8 cm-cursor-pointer" onClick={() => handleResourceOnClick(item.resource)}>
                <img height={40} width={50} src={item.resource.content.thumbnailUrl ?? FALL_BACK_RESOURCE} alt="" style={{objectFit: "scale-down"}}/>
                <Text style={{width: "250px"}} ellipsis={{tooltip: item.resource.title}} className="cm-font-fam500">{item.resource.title}</Text>
            </div>
        ),
        _type: (item: any) => {
            const type = item.resource.type.charAt(0).toUpperCase() + item.resource.type.slice(1).toLowerCase();
            return <div>{type}</div>;
        },
        _time_spent: (timeSpent: number) => (
            <div>{CommonUtil.__getFormatDuration(timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}</div>
        ),
        _views: (views: number) => (
            <div>{views}</div>
        ),
    };

    const columns: any = [
        {
            title     : 'Content',
            key       : 'content',
            render    : renderers._content,
            width     : "50%"
        },
        {
            title     : 'Time Spent',
            key       : 'time_spent',
            dataIndex : 'timeSpent',
            width     : '25%',
            render    : renderers._time_spent,

        },
        {
            title     : 'Views',
            key       : 'views',
            dataIndex : 'views',
            width     : "13%",
            render    : renderers._views,

        },
        {
            title     : 'Type',
            key       : 'type',
            render    : renderers._type,
            width     : "12%"
        }
    ]

    if(error) return <SomethingWentWrong />

    return (
        <div className="j-analytics-overview-card cm-padding-block10 cm-flex-direction-column" style={{rowGap: "0", height: "370px"}}>
            <Text className="cm-secondary-text cm-padding-inline15 cm-font-fam500">Top Performing Resources</Text>
            <Table
                className       =   "cm-padding15" 
                size            =   "small"
                pagination      =   {false}
                columns         =   {columns} 
                dataSource      =   {data?.resourceStats}
                scroll          =   {{y: 270}}
                locale          =   {{
                    emptyText   :   <div className='cm-flex-center' style={{height: "250px"}}>
                                        {loading || !data ? (error ? <SomethingWentWrong/> : <Loading />) : <NoResultFound message='No resources found' />}
                                    </div>
                }}
            />
            <SellerResourceViewerModal
                isOpen          =   {viewResourceProp.isOpen}
                onClose         =   {viewResourceProp.onClose}
                fileInfo        =   {viewResourceProp.resourceInfo}
                track           =   {false}
            />
        </div>
    )
}

export default ResourceStats