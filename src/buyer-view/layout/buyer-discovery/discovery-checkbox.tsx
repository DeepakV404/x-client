import { useState } from "react";
import { Checkbox } from "antd";

const DiscoveryCheckbox = (props: any) => {

    const { question, onChange, disabled, value }  =   props;

    const [selectedOptions, setSelectedOptions] =   useState<any>(value ? value : []);

    return (
        <Checkbox.Group 
            value           =   {selectedOptions}
            rootClassName   =   'j-option-wrapper j-custom-checkbox-wrapper'
            onChange        =   {(selectedItems: any) => {onChange(selectedItems); setSelectedOptions(selectedItems)}}
            disabled        =   {disabled}
        >
            {question.options.map((_option: any) => (
                <Checkbox
                    key         =   {_option.uuid}
                    value       =   {_option.uuid}
                    className   =   {selectedOptions.includes(_option.uuid) &&('j-buyer-option-checked')}
                >
                    {_option.value}
                </Checkbox>
            ))}
        </Checkbox.Group>
    )
}
export default DiscoveryCheckbox