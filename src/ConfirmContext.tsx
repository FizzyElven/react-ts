import {createContext, type ReactNode, useContext, useState} from "react";
import type {ConfirmOptions} from "./types/types.ts";
import Modal from "./components/Modal.tsx";
import {ConfirmationDialog} from "./components/ConfirmationDialog.tsx";

interface ConfirmContextType {
    confirm: (options: ConfirmOptions) => any;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
    const [config, setConfig] = useState<ConfirmOptions | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const confirm = (options: ConfirmOptions) => setConfig(options);
    const handleCancel = () => {
        setError(null);
        setConfig(null)
    }
    const handleConfirm = async () => {
        if (!config) return;

        setIsLoading(true);
        setError(null);
        const {error} = await config.confirmAction()
        if (!error) {
            setConfig(null)
        } else {
            setError(error)
        }
        setIsLoading(false)
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {config && <Modal isOpen={Boolean(config)} onClose={handleCancel}>
                    <ConfirmationDialog
                        {...config}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                        isLoading={isLoading}
                        error={error}
                    />
            </Modal>}
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const context = useContext(ConfirmContext);
    if (!context) throw new Error("useConfirm must be used within ConfirmProvider");
    return context.confirm;
}