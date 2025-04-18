import { useEffect, useState } from 'react';

const OtpInput = (props: {length: number, otpRef: any, onSubmit: () => void}) => {

    const { length, otpRef, onSubmit }        =   props;

    const [otp, setOtp]             =   useState(new Array(length).fill(""));

    useEffect(() => {
        if(otpRef.current[0]){
            otpRef.current[0].focus();
        }
    }, [])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {            
            if (otp.every(item => item !== "") && event.key === "Enter") {
                onSubmit();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [otp]);

    const _handlePaste = (event: ClipboardEvent) => {
        event.preventDefault();
        const pastedData = (event.clipboardData)?.getData('text');
        if (!pastedData || pastedData.length !== props.length) return;
        const digits = pastedData.split('').map((char: any) => !isNaN(char) ? char : "");
        setOtp(digits.slice(0, props.length));
        if(otpRef.current.length > 0) {
            otpRef.current[props.length - 1].focus();
        }
    };

    const _handleInputChange = (event: any, _index: number) => {
        const value = event.target.value;
        if(isNaN(value)) return
        const newOtp = [...otp];
        newOtp[_index] = value.substring(value.length - 1)
        setOtp(newOtp)

        if(value && _index < length - 1 && otpRef.current[_index + 1]){
            otpRef.current[_index + 1].focus()
        }
    }

    const _handleInputClick = (_index: number) => {
        otpRef.current[_index].setSelectionRange(1, 1)
    }

    const _handleKeyDown = (_event: any, _index: number) => {
        if(_event.key === "Backspace" && !otp[_index] && _index > 0 && otpRef.current[_index - 1]){
            otpRef.current[_index - 1].focus()
        }
    }

    return (
        <div className="cm-border-primary cm-otp-wrapper">
            {
                otp.map((_value, _index) => (
                    <input
                        className   =   "cm-otp-input cm-text-align-center"
                        type        =   "text"
                        key         =   {_index}
                        value       =   {_value}
                        onPaste     =   {(_event: any) => _handlePaste(_event)}
                        ref         =   {(_input: any) => (otpRef.current[_index] = _input)}  
                        onChange    =   {(_event: any) => _handleInputChange(_event, _index)}
                        onClick     =   {(_event: any) => _handleInputClick(_index)}
                        onKeyDown   =   {(_event: any) => _handleKeyDown(_event, _index)}
                    />
                ))
            }
        </div>
    )
}

export default OtpInput