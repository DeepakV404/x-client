import { Button, Result } from "antd";

const SFDCError = (props: {error: any}) => {
    
    const { error } =   props;

    console.log("errors: ", error.graphQLErrors)

    return (
        <div className="cm-height100 cm-flex-center">
            <Result
                status      =   "warning"
                title       =   {<div className="cm-font-fam500 ">Something went wrong</div>}
                subTitle    =   {""}
                extra       =   {
                                    [
                                        <Button key={"refresh"} onClick={() => {}}>Try Again</Button>
                                    ]
                                }
            >
            </Result>
        </div>
    )
}

export default SFDCError