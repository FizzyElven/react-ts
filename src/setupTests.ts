import '@testing-library/jest-dom/vitest';
import { beforeAll, vi } from "vitest";

beforeAll(() => {
    HTMLDialogElement.prototype.showModal = vi.fn(function mock(this: HTMLDialogElement) {
        this.setAttribute('open', '');
    });

    HTMLDialogElement.prototype.close = vi.fn(function mock(this: HTMLDialogElement) {
        this.removeAttribute('open');
    });
});