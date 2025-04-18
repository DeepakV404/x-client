import BuyerWidgetHeader from "./widget-header";

const BuyerHeaderWidget = (props: {widget: any}) => {

    const { widget }    =   props;

    return(
        <div className='j-buyer-section-card' id={widget.uuid}>
            {
                widget.components.map((component: any) => (
                    <BuyerWidgetHeader component={component}/>
                ))
            }
        </div>
    )
}

export default BuyerHeaderWidget