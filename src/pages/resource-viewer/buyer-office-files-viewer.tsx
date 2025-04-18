import { useImperativeHandle } from 'react'


const SellerOfficeFilesViewer = (props: {resource: any, officeFileViewRef: any}) => {

    const { resource, officeFileViewRef }  =   props;

    useImperativeHandle(officeFileViewRef, () => ({
        closeOfficeFilesViewer: () => {}
    }))

    return (
        <div className="cm-height100 cm-width100 cm-flex-center">
            <iframe className='j-office-iframe' width="100%" height="100%" src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(resource.content.url)}`} style={{borderRadius: "8px"}} frameBorder={0} ></iframe>
        </div>
    )
}

export default SellerOfficeFilesViewer