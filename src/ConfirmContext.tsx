import {createContext, type ReactNode, useContext, useState} from "react";
import type {ConfirmOptions} from "./types/types.ts";
import Modal from "./components/Modal.tsx";
import {ConfirmationDialog} from "./components/ConfirmationDialog.tsx";

interface ConfirmContextType {
    confirm: (options: ConfirmOptions) => void;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
    const [config, setConfig] = useState<ConfirmOptions | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const confirm = (options: ConfirmOptions) => setConfig(options);
    const handleCancel = () => setConfig(null);
    const handleConfirm = async () => {
        if (!config) return;

        setIsLoading(true);
        setError(null);

        try {
            await config.onConfirm();
            setConfig(null); // only close on success
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {config && <Modal isOpen={Boolean(config)} onClose={handleCancel}>
                {config && (
                    <ConfirmationDialog
                        {...config}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                        isLoading={isLoading}
                        error={error}
                    />
                )}
            </Modal>}
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const context = useContext(ConfirmContext);
    if (!context) throw new Error("useConfirm must be used within ConfirmProvider");
    return context.confirm;
}