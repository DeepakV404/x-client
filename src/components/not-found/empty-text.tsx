
const EmptyText = (props: {text?: string}) => {

    const { text = "Not found" }  =   props;

    return (
        <div className='cm-height100 cm-flex-center cm-empty-text'>{text}</div>
    )
}

export default EmptyText