import {BTN_VARIANT, type btnVariant} from "../../types/types.ts";
import type {ComponentPropsWithoutRef, ReactNode} from "react";
interface Props extends ComponentPropsWithoutRef<"button">{
    btnVariant: btnVariant,
    children: ReactNode,
    styles?: string,
}

function Button({btnVariant: btnVariant, children, styles = "", ...props} : Props) {
    return (
        <button {...props} className={"transition bg-white hover:bg-gray-50 shadow-lg shadow-gray-200 border-2 px-2.5 text-2xl rounded-full cursor-pointer dark:bg-gray-900 dark:shadow-gray-950 dark:hover:bg-gray-800 " + `${btnVariant === BTN_VARIANT.DANGER ? "hover:border-red-400 focus-within:border-red-300 border-red-600 dark:border-red-500" : "hover:border-blue-400 focus-within:border-blue-300 border-blue-600 dark:border-blue-400"} ${styles}`}>
            {children}
        </button>
    );
}

export default Button;
