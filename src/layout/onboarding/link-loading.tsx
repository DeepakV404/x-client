import { Progress, ProgressProps } from "antd";
import { useEffect, useState } from "react";

const LinkLoading = (props: {strokeWidth?: number}) => {

    const { strokeWidth=5 }   =   props;

    const [loader,setLoader]            =     useState<any>({
        percent     :   5,
        instance    :   ""
    });

    const showLoading = function() {
        setLoader((prev: any) => ({
            ...loader,
            percent: prev.percent === 90 ? prev.percent : prev.percent + 5
        }))
    }

    useEffect(() => {
		loader.instance = setInterval(showLoading, 100);
    },[])

    const twoColors: ProgressProps['strokeColor'] = {
        '0%': '#C7DFFF',
        '100%': '#0065E5',
    };

    return (
        <Progress className="j-line-loading" strokeColor={twoColors} style={{strokeWidth: strokeWidth}} percent={loader.percent} showInfo={false} status="active"/>
    )
}

export default LinkLoading;