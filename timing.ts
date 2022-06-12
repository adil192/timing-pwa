
export let square: HTMLElement;
export let resultMsLabel: HTMLHeadingElement;
export let resultDescLabel: HTMLParagraphElement;

export let themeColor: string;

let currentMs: number = 500;

enum State {
	Blinking,
	Results
}
let state: State = State.Blinking;

function timeout(ms): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

let timingThreadRunning: boolean = false;
async function timingThread() {
	if (timingThreadRunning) return;
	timingThreadRunning = true;

	while (true) {
		if (state == State.Blinking) {
			square.style.backgroundColor = themeColor;
			await timeout(currentMs);
			square.style.backgroundColor = "transparent";
			await timeout(1000);
		} else {
			square.style.backgroundColor = themeColor;
			await timeout(1000);
		}
	}
}

window.addEventListener("load", () => {
	square = document.querySelector("square");
	resultMsLabel = square.querySelector("h2");
	resultDescLabel = square.querySelector("p");
	themeColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-color');

	start();

	timingThread();
});

function start() {
	resultMsLabel.innerText = "";
	resultDescLabel.innerText = "";
	square.style.backgroundColor = "transparent";
}
