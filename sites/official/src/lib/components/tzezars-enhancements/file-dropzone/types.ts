import type { Snippet } from "svelte";

export type FileRejectionReason = 
  | 'size-exceeded'
  | 'type-not-allowed'
  | 'max-files-reached';

export interface FileRejection {
  file: File;
  reason: FileRejectionReason;
}

export interface DropzoneProps {
  /** Handler for successful file uploads */
  onUpload: (files: File[]) => Promise<void>;
  /** Handler for rejected files */
  onFileRejected?: (rejection: FileRejection) => void;
  /** Maximum allowed files */
  maxFiles?: number;
  /** Current number of uploaded files */
  fileCount?: number;
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Accepted file types (e.g., "image/*,.pdf") */
  accept?: string;
  /** Custom class names */
  class?: string;
  /** Whether the dropzone is disabled */
  disabled?: boolean;
  /** Custom slot content */
  children?: Snippet;
}