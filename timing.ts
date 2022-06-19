
export enum State {
	Blinking,
	Results
}

function timeout(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}
// breaks up a timeout into increments to allow for breaking early at some point
async function cautiousTimeout(ms: number, earlyBreak: () => boolean) {
	if (earlyBreak()) return;

	let elapsed = 0;
	for (const increment = 80, stop = ms - increment; elapsed <= stop; elapsed += increment) {
		await timeout(increment);
		if (earlyBreak()) return;
	}

	await timeout(ms - elapsed);
}

class _Timing {
	public square: HTMLElement;
	public resultMsLabel: HTMLHeadingElement;
	public resultDescLabel: HTMLParagraphElement;
	public guessesRange: HTMLInputElement;
	public guessesValue: HTMLParagraphElement;
	public guessesSubmit: HTMLButtonElement;

	private readonly fps: number = 60;
	private currentMs: number = 500;
	private inputMs: number = 0;

	#state: State = State.Blinking;
	public get state() {
		return this.#state;
	}
	private set state(state: State) {
		this.#state = state;
		switch (state) {
			case State.Blinking:
				this.currentMs = Math.round(1000 * Math.round(Math.random() * this.fps) / this.fps);

				this.resultMsLabel.innerText = "";
				this.resultDescLabel.innerText = "";

				this.square.style.opacity = "0";
				this.square.style.cursor = "initial";
				break;
			case State.Results:
				let diffMs = Math.abs(this.currentMs - this.inputMs);
				let diffFrames = Math.round(diffMs * this.fps / 1000);

				this.resultMsLabel.innerText = this.currentMs + "ms";
				this.resultDescLabel.innerText = `You were ${diffFrames} frames off with your guess of ${this.inputMs}ms!`;

				this.square.style.opacity = "1";
				this.square.style.cursor = "pointer";
				break;
		}
	}

	constructor() {
		window.addEventListener("load", () => {
			// set up PWA service worker
			if('serviceWorker' in navigator){
				navigator.serviceWorker.register("sw.js")
					.then(reg => console.log('service worker registered:', reg))
					.catch(err => console.log('service worker not registered', err));
			}

			this.square = document.querySelector("square");
			this.resultMsLabel = this.square.querySelector("h2");
			this.resultDescLabel = this.square.querySelector("p");
			this.guessesRange = document.querySelector("#guessesRange");
			this.guessesValue = document.querySelector("#guessesValue");
			this.guessesSubmit = document.querySelector("#guessesSubmit");

			this.guessesRange.addEventListener("input", () => {
				this.inputMs = Math.round(this.guessesRange.valueAsNumber);
				this.guessesValue.innerText = this.inputMs + "ms";
			})
			this.guessesSubmit.addEventListener("click", () => {
				this.btnClicked();
			})
			this.square.addEventListener("click", () => {
				this.squareClicked();
			})

			this.state = State.Blinking;
			this.timingThread().then();
		});
	}

	private timingThreadRunning: boolean = false;
	async timingThread() {
		if (this.timingThreadRunning) return;
		let timingThreadRunning = true;

		// noinspection InfiniteLoopJS
		while (true) {
			if (this.state == State.Blinking) {
				this.square.style.opacity = String(1);
				await cautiousTimeout(this.currentMs, () => this.state != State.Blinking);
				if (this.state != State.Blinking) continue;

				this.square.style.opacity = String(0);
				await cautiousTimeout(1000, () => this.state != State.Blinking);
			} else if (this.state == State.Results) {
				this.square.style.opacity = String(1);
				await cautiousTimeout(1000, () => this.state != State.Results);
			}
		}
	}

	private btnClicked() {
		if (this.state == State.Blinking) {
			this.state = State.Results;
			this.guessesSubmit.innerText = "Reset";
		} else {
			this.state = State.Blinking;
			this.guessesSubmit.innerText = "Submit";
		}
	}

	private squareClicked() {
		if (this.state != State.Results) return;
		this.state = State.Blinking;
	}

}

export let Timing = new _Timing();

console.log(Timing);
