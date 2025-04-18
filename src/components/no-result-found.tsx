import { Space } from 'antd';

const NoResultFound = (props: {message?: any, description?: string}) => {

    const { message="No Results Found", description } = props;

    return (
        <Space direction='vertical' className='cm-flex-center' size={5}>
            <div>{message}</div>
            <div className='cm-empty-text cm-font-size12 cm-text-align-center'>{description}</div>
        </Space>
    );
}

export default NoResultFound;
