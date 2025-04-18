import VendorModeWelcome from "../welcome/vendor-mode-welcome/vendor-mode-welcome"

const Marketplace_Onboarding = () => {

    return(
        <div className="cm-height100">
            <div className="j-mp-onboarding-header cm-font-size16 cm-font-fam500 cm-flex-align-center cm-flex-space-between cm-padding-inline20">
                Marketplace
            </div>
            <div style={{height: "calc(100% - 50px)", overflow: "auto"}}>
                <VendorModeWelcome/>
            </div>
        </div>
    )
}

export default Marketplace_Onboarding