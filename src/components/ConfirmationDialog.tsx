import {BTN_VARIANT, type ConfirmDialog} from "../types/types.ts";
import Button from "./ui/Button.tsx";


export function ConfirmationDialog({title, text, btnVariant, confirmText, onConfirm, onCancel}: ConfirmDialog) {
    return (
        <div className="flex flex-col gap-2.5 justify-center items-center p-5">
            <h2 className="text-2xl">{title}</h2>
            <p className="text-2xl">{text}</p>
            <div className="flex justify-between items-center w-full gap-5">
                <Button btnVariant={btnVariant === BTN_VARIANT.PRIMARY ? BTN_VARIANT.PRIMARY : BTN_VARIANT.DANGER}
                        onClick={onConfirm}>{confirmText}</Button>
                <Button btnVariant={BTN_VARIANT.PRIMARY} onClick={onCancel}>Cancel</Button>
            </div>
        </div>
    );
}
