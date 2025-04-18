
const BuyerWidgetTitle = (props: {widget: any}) => {

    const { widget }    =   props;

    return (
        <div className="tiptap j-buyer-widget-title" style={{ paddingInline: "0px", minHeight: "20px"}} dangerouslySetInnerHTML={{__html: widget.title.value || ""}}></div> 
    )
}

export default BuyerWidgetTitle