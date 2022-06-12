
export let square: HTMLElement;
export let resultMsLabel: HTMLHeadingElement;
export let resultDescLabel: HTMLParagraphElement;

export let themeColor: string;

const fps: number = 60;
let currentMs: number = 500;

enum State {
	Blinking,
	Results
}
let state: State = State.Blinking;

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

let timingThreadRunning: boolean = false;
async function timingThread() {
	if (timingThreadRunning) return;
	timingThreadRunning = true;

	// noinspection InfiniteLoopJS
	while (true) {
		if (state == State.Blinking) {
			square.style.backgroundColor = themeColor;
			await cautiousTimeout(currentMs, () => state != State.Blinking);
			if (state != State.Blinking) continue;

			square.style.backgroundColor = "transparent";
			await cautiousTimeout(1000, () => state != State.Blinking);
		} else if (state == State.Results) {
			square.style.backgroundColor = themeColor;
			await cautiousTimeout(1000, () => state != State.Results);
		}
	}
}

window.addEventListener("load", () => {
	square = document.querySelector("square");
	resultMsLabel = square.querySelector("h2");
	resultDescLabel = square.querySelector("p");
	themeColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-color');

	document.querySelectorAll("#guessesRow button").forEach((btn, i) => {
		btn.addEventListener("click", () => {
			let ms: number = parseInt(btn.getAttribute("data-ms"));
			btnClicked(ms);
		});
	});

	start();
	timingThread().then();
});

function start() {
	resultMsLabel.innerText = "";
	resultDescLabel.innerText = "";
	square.style.backgroundColor = "transparent";

	currentMs = Math.floor(1000 * Math.round(Math.random() * fps) / fps);
}

function btnClicked(inputMs: number) {
	if (state != State.Blinking) return;
	state = State.Results;

	let diffMs = Math.abs(currentMs - inputMs);
	let diffFrames = Math.round(diffMs * fps / 1000);

	resultMsLabel.innerText = currentMs + "ms";
	resultDescLabel.innerText = `You were ${diffFrames} frames off with your guess of ${inputMs}ms!`;
}
