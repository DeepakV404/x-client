import { Drawer } from 'antd';

import EditResourceForm from './edit-resource-form';

const EditResourceModal = (props: {isOpen: boolean, onClose: () => void, resource: any}) => {

    const { isOpen, onClose, resource }   =   props;
    

    return (
        <Drawer
            width           =   {600}
            open            =   {isOpen} 
            onClose         =   {onClose}
            className       =   "j-library-slider"
            headerStyle     =   {{display:'none'}}
            style           =  {{padding:'0px'}}
        >
            {
                resource && 
                    <EditResourceForm {...props}/>
            }
        </Drawer>
    )
}

export default EditResourceModal