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
        }} className="m-auto rounded-lg shadow-2xl/30">
            <div className="relative" onClick={(event) => event.stopPropagation}>
                <button onClick={onClose} className="absolute right-2 font-bold text-xl">X</button>
                {children}
            </div>
        </dialog>
    );
};
export default Modal