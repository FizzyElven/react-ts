import {type ReactNode, type ReactEventHandler, useEffect, useRef} from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: ReactEventHandler,
    children: ReactNode,
}

const Modal = ({isOpen, onClose, children}: ModalProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (dialog) {
            if (isOpen) {
                dialog.showModal(); // Opens as a modal (blocks page interaction)
            } else {
                dialog.close();
            }
        }

    }, [isOpen]);

    return (
        <dialog ref={dialogRef} onClose={onClose} onClick={(event) => {
            if (event.currentTarget === event.target) {
                onClose(event)
            }
        }} className="m-auto rounded-2xl shadow-2xl/30 border border-gray-400">
            <div className="relative" onClick={(event) => event.stopPropagation}>
                <button onClick={onClose}
                        className="absolute leading-none border border-transparent focus-visible:border-blue-300 focus-visible:shadow-lg flex justify-center items-center hover:bg-gray-100 top-2 right-2 font-bold text-3xl outline-none w-11.25 h-11.25 rounded-full">
                    <p className="leading-none inline-block transform -translate-y-px">×</p>
                </button>
                {children}
            </div>
        </dialog>
    );
};
export default Modal