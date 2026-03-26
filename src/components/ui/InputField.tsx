import {type ComponentPropsWithoutRef, type ReactNode, useId} from "react";

interface Props extends ComponentPropsWithoutRef<"input"> {
    children?: ReactNode,
    styles?: string,
    label?: string,
}

function InputField({children, styles = "", label, ...props}: Props) {
    const id = useId();
    return (
        <>
            {label && <label htmlFor={id} className="font-bold">{label}</label>}
            <div
                className={`group transition shadow-lg shadow-gray-200 hover:border-blue-400 focus-within:border-blue-300 focus-within:shadow-lg border-2 border-blue-600 rounded-full px-2 w-md text-2xl p-2.5 flex ` + styles}>
                {children}
                <input id={id} className="w-full outline-none ml-2.5" {...props}/>
            </div>
        </>
    );
}
export default InputField;