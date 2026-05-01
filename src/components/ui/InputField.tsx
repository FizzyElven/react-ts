import {type ComponentPropsWithoutRef, type ReactNode, useId} from "react";

interface Props extends ComponentPropsWithoutRef<"input"> {
    children?: ReactNode,
    styles?: string,
    label?: string,
    hiddenLabel?: boolean,
}

function InputField({children, styles = "", label, hiddenLabel, ...props}: Props) {
    const id = useId();
    return (
        <>
            {label && <label htmlFor={id} className={hiddenLabel ? "sr-only" : "font-bold"}>{label}</label>}
            <div
                className={`group transition bg-white shadow-lg shadow-gray-200 hover:border-blue-400 focus-within:border-blue-300 focus-within:shadow-lg border-2 border-blue-600 rounded-full px-2 w-md text-2xl p-2.5 flex dark:bg-gray-900 dark:shadow-gray-950 dark:border-blue-400 ` + styles}>
                {children}
                <input id={id} className="w-full bg-transparent outline-none ml-2.5 placeholder:text-gray-500 dark:placeholder:text-gray-400" {...props}/>
            </div>
        </>
    );
}
export default InputField;
