import {BTN_VARIANT, type ConfirmOptions} from "../types/types.ts";
import Button from "./ui/Button.tsx";
interface ConfirmDialog extends ConfirmOptions {
    isLoading: boolean;
    error: string | null;
    onCancel: () => void;
}
export function ConfirmationDialog({title, text, btnVariant, confirmText, onConfirm, onCancel, isLoading, error}: ConfirmDialog) {
    return (
        <div className="flex flex-col gap-2.5 justify-center items-center p-5">
            <h2 className="text-2xl">{title}</h2>
            <p className="text-2xl">{text}</p>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-between items-center w-full gap-5">
                <Button aria-label={"confirm dialog, confirm " + title} btnVariant={btnVariant === BTN_VARIANT.PRIMARY ? BTN_VARIANT.PRIMARY : BTN_VARIANT.DANGER}
                        onClick={onConfirm} disabled={isLoading}>{confirmText}</Button>
                <Button aria-label={"confirm dialog, cancel " + title} btnVariant={BTN_VARIANT.PRIMARY} onClick={onCancel} disabled={isLoading}>Cancel</Button>
            </div>
        </div>
    );
}
