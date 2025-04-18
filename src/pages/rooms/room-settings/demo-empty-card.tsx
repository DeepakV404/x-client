import { Space, Typography } from 'antd';

const { Paragraph }  =   Typography;

const DemoEmptyCard = (props: {imgSource?: string, title?: string, handleRemove?: () => void, addResource?: boolean}) => {

    const { imgSource, title, handleRemove, addResource }  =   props;

    return (
        <div className='j-empty-resource-card cm-position-relative' style={{marginTop : !addResource ? "0" : "20px"}}>
            <div className='j-empty-resource-card-inner'>
                {imgSource ? <img src={imgSource} style={{width: "100%", height: "100%", borderRadius: "inherit", objectFit: "scale-down"}}/> : null}
            </div>  
           <Space direction='vertical' className='cm-width100' size={12}>
            {
                title ?
                    <Paragraph ellipsis={{rows:3, expandable: false}} className='cm-font-fam500'>{title}</Paragraph>
                :
                    <>
                        <div className='j-empty-resource-card-inner-side-bar'></div>
                        <div className='j-empty-resource-card-inner-side-bar'></div>
                        <div className='j-empty-resource-card-inner-side-bar' style={{width: "80%"}}></div>
                    </>
            }
           </Space>
           {
                addResource && handleRemove ?
                    <div className='cm-link-text j-remove-demo-resource cm-cursor-pointer' onClick={() => handleRemove()}>Remove</div>
                :
                    null
           }
        </div>
    )
}

export default DemoEmptyCard