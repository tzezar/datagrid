import FileDropzone from './file-dropzone.svelte';
import type { FileRejectionReason, DropzoneProps } from './types';

export const displaySize = (bytes: number): string => {
    if (bytes < KILOBYTE) return `${bytes.toFixed(0)} B`;

    if (bytes < MEGABYTE) return `${(bytes / KILOBYTE).toFixed(0)} KB`;

    if (bytes < GIGABYTE) return `${(bytes / MEGABYTE).toFixed(0)} MB`;

    return `${(bytes / GIGABYTE).toFixed(0)} GB`;
};

// Helper constants
export const BYTE = 1;
export const KILOBYTE = 1024;
export const MEGABYTE = 1024 * KILOBYTE;
export const GIGABYTE = 1024 * MEGABYTE;

export const ACCEPT_IMAGE = 'image/*';
export const ACCEPT_VIDEO = 'video/*';
export const ACCEPT_AUDIO = 'audio/*';

export { FileDropzone, type FileRejectionReason, type DropzoneProps };