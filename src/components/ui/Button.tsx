import {BTN_VARIANT, type btnVariant} from "../../types/types.ts";
import type {ComponentPropsWithoutRef, ReactNode} from "react";
interface Props extends ComponentPropsWithoutRef<"button">{
    btnVariant: btnVariant,
    children: ReactNode,
    styles?: string,
}

function Button({btnVariant: btnVariant, children, styles = "", ...props} : Props) {
    return (
        <button {...props} className={"transition hover:bg-gray-50 shadow-lg shadow-gray-200 border-2 px-2.5 text-2xl rounded-full cursor-pointer " + `${btnVariant === BTN_VARIANT.DANGER ? "hover:border-red-400 focus-within:border-red-300 border-red-600" : "hover:border-blue-400 focus-within:border-blue-300 border-blue-600"} ${styles}`}>
            {children}
        </button>
    );
}

export default Button;