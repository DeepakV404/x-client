import { Space, Typography } from 'antd';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import { CommonUtil } from '../../../../utils/common-util';

const { Text }  =   Typography

interface Resource {
    title: string;
    type: string;
    uuid: string;
}
interface ResourceView {
    downloadCount: number;
    lastViewedAt: number;
    resource: Resource;
    timeSpent: number;
    views: number;
}

const DeckVideoAnalytics = (props: { selectedResourceCard?: ResourceView }) => {

    const { selectedResourceCard } = props;

    return (
        <div className='cm-flex cm-gap15 cm-padding20'>
            <div className='cm-border-light cm-padding10 cm-border-radius6' style={{width: "235px"}}>
                <Space className='cm-flex-space-between'>
                    <Space direction='vertical'>
                        <Text className='cm-font-size15 cm-font-opacity-black-65'>No of Views</Text>
                        <Text className='cm-font-size18 cm-font-fam500'>{selectedResourceCard?.views}</Text>
                    </Space>
                    <div className='cm-padding5 cm-flex-center' style={{height: "40px", width: "40px", borderRadius: "50%", backgroundColor: "#E8E8EC"}}><MaterialSymbolsRounded font='visibility' size='20'/></div>
                </Space>
            </div>
            <div className='cm-border-light cm-padding10 cm-border-radius6' style={{width: "235px"}}>
                <Space className='cm-flex-space-between'>
                    <Space direction='vertical'>
                        <Text className='cm-font-size15 cm-font-opacity-black-65'>Watch Time</Text>
                        <Text className='cm-font-size18 cm-font-fam500 cm-whitespace-nowrap'>{CommonUtil.__getFormatDuration(selectedResourceCard?.timeSpent ?? 0).map((_stamp: any) =>`${_stamp.value} ${_stamp.unit}`).join(" ")}</Text>
                    </Space>
                    <div className='cm-padding5 cm-flex-center' style={{height: "40px", width: "40px", borderRadius: "50%", backgroundColor: "#E8E8EC"}}><MaterialSymbolsRounded font='timer' size='18'/></div>
                </Space>
            </div>
        </div>
    );
};

export default DeckVideoAnalytics;
