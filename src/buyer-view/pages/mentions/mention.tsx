import { Form } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useState } from 'react'
import { MentionsInput ,Mention } from 'react-mentions'
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded'
import mentionsInputStyle from './mentionsInputStyle'
import useLocalization from '../../../custom-hooks/use-translation-hook'

const data = [
    {
        id: "deva",
        display: "Deva",
    },
    {
        id: "deepak",
        display: "Deepak",
    },
    {
        id: "deva123",
        display: "Deva",
    },
    {
        id: "deepak123123",
        display: "Deepak",
    }
]

const Mentions = () => {
    const [value, setValue] = useState("")
    const [form]    =   useForm();

    const { translate } = useLocalization();

    const onFinish = (values: any) => {
        console.log("values: ",values)
    }

    const displayTransform = (display: any) => `@${display}`;
    
    return(
            <Form form={form} onFinish={onFinish} className='j-mentions'>
                <Form.Item name={"comment"}>
                    <MentionsInput value={value} onChange={(e) => setValue(e.target.value)} className='j-input-react-mentions' style={mentionsInputStyle} placeholder={translate("common-placeholder.send-a-new-message")}>
                        <Mention trigger="@" data={data} displayTransform={displayTransform}/>
                    </MentionsInput>
                    <MaterialSymbolsRounded className='cm-cursor-pointer' font='arrow_forward' onClick={() => form.submit()}/> 
                </Form.Item> 
            </Form>
    )
}

export default Mentions