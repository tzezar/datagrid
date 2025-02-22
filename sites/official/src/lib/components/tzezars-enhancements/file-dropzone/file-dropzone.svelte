<script lang="ts">
	import { Upload } from 'lucide-svelte';
	import type { DropzoneProps, FileRejection } from './types';

	// Props
	let {
		onUpload,
		onFileRejected,
		maxFileSize,
		accept,
		maxFiles,
		fileCount = 0,
		disabled = false,
		class: className = ''
	}: DropzoneProps = $props();

	// Simple state without derived values
	let isUploading = $state(false);
	let isDragging = $state(false);
	let dropzoneId = "MIGHT_IMPLEMENT_IT_LATER"

	// Simplified validation
	function validateFile(file: File): FileRejection | null {
		if (maxFileSize && file.size > maxFileSize) {
			return { file, reason: 'size-exceeded' };
		}

		if (accept) {
			const acceptedTypes = accept.split(',').map((t) => t.trim().toLowerCase());
			const fileType = file.type.toLowerCase();
			const fileName = file.name.toLowerCase();

			const isValidType = acceptedTypes.some((type) => {
				if (type.startsWith('.')) return fileName.endsWith(type);
				if (type.endsWith('/*')) return fileType.startsWith(type.slice(0, -2));
				return fileType === type;
			});

			if (!isValidType) {
				return { file, reason: 'type-not-allowed' };
			}
		}

		if (maxFiles && fileCount >= maxFiles) {
			return { file, reason: 'max-files-reached' };
		}

		return null;
	}

	// Simplified file handling
	async function handleFiles(files: File[]) {
		if (disabled || isUploading) return;

		isUploading = true;
		const validFiles: File[] = [];

		for (const file of files) {
			const rejection = validateFile(file);
			if (rejection) {
				onFileRejected?.(rejection);
			} else {
				validFiles.push(file);
			}
		}

		if (validFiles.length > 0) {
			try {
				await onUpload(validFiles);
			} catch (error) {
				console.error('File upload failed:', error);
			}
		}

		isUploading = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		if (e.dataTransfer?.files) {
			handleFiles(Array.from(e.dataTransfer.files));
		}
	}

	function handleInputChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files) {
			handleFiles(Array.from(input.files));
			input.value = '';
		}
	}
</script>

<div
	role="button"
	tabindex="0"
	class="group relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all
    {isDragging ? 'border-primary bg-primary/10' : ''}
    {!disabled ? 'hover:border-primary hover:bg-primary/5' : 'opacity-50'}
    {className}"
	ondragover={(e) => {
		e.preventDefault();
		isDragging = true;
	}}
	ondragleave={() => (isDragging = false)}
	ondrop={handleDrop}
>
	<label for={dropzoneId} class="w-full cursor-pointer" class:cursor-not-allowed={disabled}>
		<div class="flex flex-col items-center gap-4 p-6 text-center">
			<div class="flex flex-col items-center gap-2">
				<Upload class="h-8 w-8" />

				<p class="text-lg font-medium">
					{#if isUploading}
						Uploading...
					{:else}
						Drop files or click to upload
					{/if}
				</p>
			</div>

			<div class="space-y-2">
				{#if maxFiles || maxFileSize}
					<p class="text-sm text-muted-foreground">
						{#if maxFiles}
							Upload up to {maxFiles} file{maxFiles > 1 ? 's' : ''}
							{#if maxFileSize}
								<span class="mx-1">•</span>
							{/if}
						{/if}
						{#if maxFileSize}
							Max size: {(maxFileSize / (1024 * 1024)).toFixed(0)}MB
						{/if}
					</p>
				{/if}

				{#if accept}
					<p class="text-sm text-muted-foreground">
						Accepted types: {accept}
					</p>
				{/if}
			</div>
		</div>

		<input
			id={dropzoneId}
			type="file"
			{accept}
			multiple={maxFiles ? maxFiles - fileCount > 1 : true}
			{disabled}
			class="hidden"
			onchange={handleInputChange}
		/>
	</label>
</div>
