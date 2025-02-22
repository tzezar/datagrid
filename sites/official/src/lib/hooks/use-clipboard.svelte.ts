type Options = {
	resetAfter: number;
};

export class UseClipboard {
	#copiedStatus = $state<'success' | 'failure'>();
	private resetAfter: number;
	private timeout: ReturnType<typeof setTimeout> | undefined = undefined;

	constructor({ resetAfter = 500 }: Partial<Options> = {}) {
		this.resetAfter = resetAfter;
	}


	async copy(text: string) {
		if (this.timeout) {
			this.#copiedStatus = undefined;
			clearTimeout(this.timeout);
		}

		try {
			await navigator.clipboard.writeText(text);

			this.#copiedStatus = 'success';

			this.timeout = setTimeout(() => {
				this.#copiedStatus = undefined;
			}, this.resetAfter);
		} catch {
			this.#copiedStatus = 'failure';

			this.timeout = setTimeout(() => {
				this.#copiedStatus = undefined;
			}, this.resetAfter);
		}

		return this.#copiedStatus;
	}

	get copied() {
		return this.#copiedStatus === 'success';
	}

	get status() {
		return this.#copiedStatus;
	}
}