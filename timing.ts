
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

	public themeColor: string;

	private readonly fps: number = 60;
	private currentMs: number = 500;

	private state: State = State.Blinking;

	constructor() {
		window.addEventListener("load", () => {
			this.square = document.querySelector("square");
			this.resultMsLabel = this.square.querySelector("h2");
			this.resultDescLabel = this.square.querySelector("p");
			this.themeColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-color');

			document.querySelectorAll("#guessesRow button").forEach((btn, i) => {
				btn.addEventListener("click", () => {
					let ms: number = parseInt(btn.getAttribute("data-ms"));
					this.btnClicked(ms);
				});
			});

			this.start();
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
				this.square.style.backgroundColor = this.themeColor;
				await cautiousTimeout(this.currentMs, () => this.state != State.Blinking);
				if (this.state != State.Blinking) continue;

				this.square.style.backgroundColor = "transparent";
				await cautiousTimeout(1000, () => this.state != State.Blinking);
			} else if (this.state == State.Results) {
				this.square.style.backgroundColor = this.themeColor;
				await cautiousTimeout(1000, () => this.state != State.Results);
			}
		}
	}

	private start() {
		this.resultMsLabel.innerText = "";
		this.resultDescLabel.innerText = "";
		this.square.style.backgroundColor = "transparent";

		this.currentMs = Math.floor(1000 * Math.round(Math.random() * this.fps) / this.fps);
	}

	private btnClicked(inputMs: number) {
		if (this.state != State.Blinking) return;
		this.state = State.Results;

		let diffMs = Math.abs(this.currentMs - inputMs);
		let diffFrames = Math.round(diffMs * this.fps / 1000);

		this.resultMsLabel.innerText = this.currentMs + "ms";
		this.resultDescLabel.innerText = `You were ${diffFrames} frames off with your guess of ${inputMs}ms!`;
	}

}

export let Timing = new _Timing();

console.log(Timing);
