import { Avatar, Card, Space, Tooltip, Typography } from 'antd';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';

const { Text } = Typography;

const UserToolTip = () => {
    return (
        <Card style={{ width: 300 }} className='j-custom-card'>
            <Space direction='vertical' size={5}>
                <Text className='cm-font-size12 cm-secondary-text'>Created by</Text>
                <Space align="start">
                    <Avatar
                        size={40}
                        src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                    <Space direction='vertical' style={{ width: "200px" }} size={0}>
                        <Tooltip title="Steve James">
                            <Text className='cm-font-fam500 cm-font-size13' ellipsis={{ tooltip: "Steve James" }}>Steve James</Text>
                        </Tooltip>
                        <Space size={5} >
                            <MaterialSymbolsRounded color='#737373' font='mail' size='15' />
                            <Tooltip title="stevejames@abccompany.com">
                                <Text style={{ width: "200px" }} className='cm-font-size13' ellipsis={{ tooltip: "stevejames@abccompany.com" }}>
                                    stevejames@abccompany.comstevejames@abccompany.com
                                </Text>
                            </Tooltip>
                        </Space>
                        <Text type='secondary' className='cm-font-size12 cm-secondary-text' ellipsis={{ tooltip: "yellow" }}>{new Date().getDate()}</Text>
                    </Space>
                </Space>
            </Space>
        </Card>
    )
}

export default UserToolTip;



