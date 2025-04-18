import { Card, Popconfirm, Typography } from 'antd';

import { THUMBNAIL_FALLBACK_ICON } from '../../../../constants/module-constants';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';

const { Text }  =   Typography;

const StageResourceCard = (props: {title: string, imgSource: string, handleRemove: () => void}) => {

    const { title, imgSource, handleRemove }    =   props;

    return (
        <Card className="j-stage-res-card">
            <div className="cm-flex-space-between cm-flex-align-center cm-width100">
                <div className='cm-flex-align-center' style={{columnGap: "15px"}}>
                    <div style={{width: "132px", height: "60px"}} className='cm-flex-center'>
                        {imgSource ? <img src={imgSource} style={{width: "100%", height: "100%", borderRadius: "6px", objectFit: "scale-down"}} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= THUMBNAIL_FALLBACK_ICON}}/> : null}
                    </div>
                    <Text style={{maxWidth: "380px"}} ellipsis={{tooltip: title}} className='cm-font-size15 cm-font-fam500'>{title}</Text>
                </div>
                <Popconfirm
                    placement           =   "left"  
                    title               =   {<div className="cm-font-fam500">Remove resource</div>}
                    description         =   {<div className="cm-font-size13">Are you sure you want to remove this resource?</div>}
                    icon                =   {null}
                    okButtonProps       =   {{style: {fontSize: "12px", color: "#fff !important", boxShadow: "0 0 0", lineHeight: "20px"}, danger: true}}
                    cancelButtonProps   =   {{style: {fontSize: "12px", lineHeight: "20px"}, danger: true, ghost: true}}
                    okText              =   {"Remove"}
                    onConfirm           =   {(event: any) => {event.stopPropagation(); handleRemove();}}
                    onCancel            =   {(event: any) => event?.stopPropagation()}
                >
                    <MaterialSymbolsRounded font={'delete'} size={'18'} color="#DF2222" className='cm-cursor-pointer' onClick={(event: any) => event?.stopPropagation()}/>
                </Popconfirm>
            </div>
        </Card>
    )
}

export default StageResourceCard