
export let square: HTMLElement;
export let resultMsLabel: HTMLHeadingElement;
export let resultDescLabel: HTMLParagraphElement;

export let themeColor: string;

window.addEventListener("load", () => {
	square = document.querySelector("square");
	resultMsLabel = square.querySelector("h2");
	resultDescLabel = square.querySelector("p");
	themeColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-color');

	start();
});

function start() {
	resultMsLabel.innerText = "";
	resultDescLabel.innerText = "";
	square.style.backgroundColor = "transparent";
}
