import { PREMIUM } from "../constants/module-constants"

const UpgradeIcon = (props: {size? : number}) => {

    const { size=20 } = props;

    return (
        <div style={{width: `${size}px`, height: `${size}px`, display: "flex"}}>
            <img src={PREMIUM} alt="Upgrade" style={{width: "inherit", height: "inherit"}}/>
        </div>
    )
}

export default UpgradeIcon