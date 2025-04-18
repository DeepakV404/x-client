import { Drawer } from "antd"

import RoomFilterForm from "./room-filter-form";

const RoomFilterDrawer = (props: {isOpen: boolean; onClose: () => void, setFilter: any, resetFilter: any, initialFilter: any, isFilterApplied: any}) => {

    const {isOpen, onClose} = props;

    return(
        <Drawer
            className   =   'j-demo-creation-slider'
            width       =   {400}
            onClose     =   {onClose}
            open        =   {isOpen}
            headerStyle =   {{display:'none'}}
            destroyOnClose
        >
            { isOpen && <RoomFilterForm {...props}/>}
        </Drawer>
    )   
}

export default RoomFilterDrawer