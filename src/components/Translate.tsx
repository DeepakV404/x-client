import { Trans } from "react-i18next"

const Translate = (props: {i18nKey: string}) => {
    
    const { i18nKey }   =   props;

    return (
        <Trans i18nKey={i18nKey}/>
    )
}

export default Translate