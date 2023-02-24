import React, { useState } from "react"

export default function FormField (props:any) {
    const [typePass, setTypePass] = useState(false);
    if (props.fieldType === 'input') {
        return (
            <>
            <div className='mb-4 last:mb-0'>
                <div>
                    <label htmlFor={`field_` + props.label.replace(/\s+/g, '')} className='font-bold mb-1 inline-block'>
                        {props.label} 
                        {
                            props.required ? <sup className='text-red-500'>*</sup> : ''
                        }
                    </label>
                    {
                        props.icon || props.inputType === 'password'
                        ?
                        <>
                        <div className="relative">
                            {
                                props.inputType === 'password'
                                ?
                                <>
                                <input type={typePass == true ? 'text' : props.inputType} id={`field_` + props.label.replace(/\s+/g, '')} 
                                className={`w-full border-lightGray rounded dark:bg-gray-700` + ' ' + (props.icon ? 'pr-9' : '')} />
                                <button type="button" className="absolute right-3 top-2 text-lightGray" onClick={() => setTypePass(!typePass)}>
                                    <i className={`fa-regular` + ' ' + (typePass == true ? 'fa-eye-slash' : 'fa-eye')}></i>
                                </button>
                                </>
                                :
                                <>
                                <input type={props.inputType} id={`field_` + props.label.replace(/\s+/g, '')} 
                                className={`w-full border-lightGray rounded dark:bg-gray-700` + ' ' + (props.icon ? 'pr-9' : '')} />
                                <span className="absolute right-3 top-2 text-lightGray">
                                    {props.icon}
                                </span>
                                </>
                            }
                        </div>
                        </>
                        :
                        <>
                        <input type={props.inputType} id={`field_` + props.label.replace(/\s+/g, '')} className='w-full border-lightGray rounded dark:bg-gray-700' />
                        </>
                    }
                </div>
                <p className="text-red-500 text-[12px] mt-1">Please check the field again.</p>
            </div>
            </>
        )
    }
    if (props.fieldType === 'textarea') {
        return (
            <>
            <div className='mb-4 last:mb-0'>
                <div>
                    <label htmlFor={`field_` + props.label.replace(/\s+/g, '')} className='font-bold mb-1 inline-block'>
                        {props.label} 
                        {
                            props.required ? <sup className='text-red-500'>*</sup> : ''
                        }
                    </label>
                    <textarea id={`field_` + props.label.replace(/\s+/g, '')} className='w-full border-lightGray rounded dark:bg-gray-700 resize-none min-h-[100px]'></textarea>
                </div>
                <p className="text-red-500 text-[12px] mt-1">Please check the field again.</p>
            </div>
            </>
        )
    }
    return (
        <>
            <p className="bg-violet-200 p-2 text-sm rounded">Please choose some <b>type</b> to show field here.</p>
        </>
    )
}