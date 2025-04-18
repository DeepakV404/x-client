import { FC } from "react";
import { Table } from "antd";


interface RoomsListProps
{
    columns     :   Array<any>,
    roomsList   :   Array<any>,
    onChange?   :   () => void;   
}

const RoomsList : FC<RoomsListProps> = (props) => {
    
    const { columns , roomsList , onChange }   =   props;

    return (
        <Table 
            columns     =   {columns} 
            dataSource  =   {roomsList} 
            onChange    =   {onChange} 
        />
    )
}

export default RoomsList