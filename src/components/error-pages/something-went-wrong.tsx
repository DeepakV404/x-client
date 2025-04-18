import { Button, Result } from 'antd';

const SomethingWentWrong = () => {
    return (
        <div className="cm-height100 cm-flex-center">
            <Result
                status      =   "warning"
                title       =   {<div className="cm-font-fam500 ">Something went wrong</div>}
                subTitle    =   {""}
                extra       =   {
                                    [
                                        <Button type='primary' key={"refresh"} onClick={() => window.location.reload()}>
                                            <div className='cm-font-fam500'>Try again</div>
                                        </Button>
                                    ]
                                }
            >
            </Result>
        </div>
    )
}

export default SomethingWentWrong