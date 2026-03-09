import type {ConfirmDialog} from "../types/types.ts";


export function ConfirmationDialog({title, text, btnVariant, confirmText, onConfirm, onCancel}: ConfirmDialog) {
    return (
        <div className="flex flex-col gap-2.5 justify-center items-center p-5">
            <h2 className="text-2xl">{title}</h2>
            <p className="text-2xl">{text}</p>
            <div className="flex justify-between items-center w-full gap-5">
                <button onClick={onConfirm}
                        className={`text-white text-2xl font-bold p-2.5 rounded-md cursor-pointer w-max ${btnVariant === "danger" ? "bg-red-600" : "bg-blue-600"}`}>{confirmText}</button>
                <button onClick={onCancel}
                        className="text-white text-2xl bg-blue-600 font-bold p-2.5 rounded-md cursor-pointer w-max">Cancel</button>
            </div>
        </div>
    );
}
