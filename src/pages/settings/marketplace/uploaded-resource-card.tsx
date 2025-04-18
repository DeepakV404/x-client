import { useEffect, useState } from 'react';
import { Typography } from 'antd';
import { RcFile } from 'antd/es/upload';

import { ACCEPTED_VIDEO_TYPES, IMAGE_FALLBACK_IMAGE, VIDEO_FALLBACK_IMAGE } from '../../../constants/module-constants';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';

const { Text }  =   Typography;

const UploadedResourceCard = (props: any) => {
    
    const { _file, handleRemove, fileType } =   props;

    const [imageUrl, setImageUrl]           =   useState<string>("");

    const getBase64 = (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const convertToImageUrl = () => { 
        getBase64(_file.originFileObj as RcFile, (url) => {
            setImageUrl(url);
        });
    };

    useEffect(() => {
        convertToImageUrl()
    }, [])

    return (
        <div className='cm-flex cm-flex-align-center cm-cursor-pointer cm-border-radius6 cm-padding10 cm-margin-top15' style={{border: "1px solid #f2f2f2", columnGap: "10px"}}>
            <div style={{width: "106px", height: "60px"}}>
                <img src={imageUrl} style={{width: "100%", height: "100%", borderRadius: "6px", objectFit: "scale-down"}} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= fileType === ACCEPTED_VIDEO_TYPES ? VIDEO_FALLBACK_IMAGE : IMAGE_FALLBACK_IMAGE}}/>
            </div>
            <div style={{width: "calc(100% - 150px)"}}>
                <Text style={{maxWidth: "100%"}} ellipsis={{tooltip: _file.name}} className='cm-font-size15 cm-font-fam500'>{_file.name}</Text>
            </div>
            <MaterialSymbolsRounded font={'delete'} size={'18'} color="#DF2222" className='cm-cursor-pointer' onClick={() => handleRemove(_file.uid)}/>
        </div>
    )
}

export default UploadedResourceCard