
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { FC } from 'react';

interface LoadingProps
{
	className?	:	string;
	loading?	:	boolean;		
	color?		:	string;
	size?		:	"default" | "small" | "large";
	children?	: 	any;
	fontSize?	:	number;
}

const Loading: FC<LoadingProps> = (props) => {

	const { className="", loading=true, color="#000", size="default", children, fontSize=20 }	=	props;

    return (
		<div className={`cm-height100 cm-flex-center ${className}`}>
			<Spin spinning={loading} size={size} style={color ? {color: color} : undefined} className={`pp-loading-spin`} indicator={<LoadingOutlined style={{ fontSize: fontSize }} spin/>} >
				{children}
			</Spin>
		</div>
	)
}

export default Loading;
