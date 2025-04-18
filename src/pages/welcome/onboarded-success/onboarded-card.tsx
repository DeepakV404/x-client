import { Button, Space } from 'antd';
import Lottie from 'react-lottie';

import animationData from '../lotties/onboarded-successfully.json';

const OnboardedCard = (props: {onClose: () => void}) => {

    const { onClose }   =   props;

    const defaultOptions = {
        loop            :   false,
        autoplay        :   true,
        animationData   :   animationData,
        rendererSettings:   
        {
            preserveAspectRatio :   "xMidYMid slice"
        }
    };

    return (
        <>
            <Space direction='vertical' className='cm-height100' size={30} style={{display: "flex", justifyContent: "center"}}>
                <div style={{fontSize: "75px"}} className='cm-flex-center'>🎉</div>
                <Space direction='vertical' className='cm-flex-center'>
                    <div style={{fontSize: "50px"}} className='cm-font-fam600'>Welcome aboard</div>
                    <div className='cm-font-fam500 cm-font-size16'>We're thrilled to have you on board and look forward to the exciting journey ahead.</div>
                </Space>
                <div className='cm-flex-center'><Button size='large' type='primary' onClick={() => onClose()}>Get Started</Button></div>
            </Space>
            <Lottie 
                options =   {defaultOptions}
                height  =   {550}
                width   =   {300}
                style   =   {{
                    width: "300px",
                    height: "100%",
                    overflow: "hidden",
                    margin: "0px auto",
                    outline: "none",
                    position: "absolute",
                    top: "45px",
                    left: "45px",
                    transform: "rotate(45deg)"
                }}
            />
            <Lottie 
                options =   {defaultOptions}
                height  =   {550}
                width   =   {300}
                style   =   {{
                    width: "300px",
                    height: "100%",
                    overflow: "hidden",
                    margin: "0px auto",
                    outline: "none",
                    position: "absolute",
                    top: "45px",
                    right: "45px",
                    transform: "rotate(-45deg)"
                }}
            />
        </>
    )
}

export default OnboardedCard