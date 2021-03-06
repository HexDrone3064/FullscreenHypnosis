const foregroundId = 'HexDrone3064_foreground';
const backgroundId = 'HexDrone3064_background';

const images = [
	'DRONEPOST.gif', 
	'CONVERTGIF.gif', 
	'DRONEGIF.gif', 
	'HEXCORPGIF.gif', 
	'hexcorpspiral2.gif', 
	'HEXLATEXGIF.gif', 
	'OBEYGIF.gif', 
	'SERVEGIF.gif', 
	'SUBMITGIF.gif',
].map(x => chrome.runtime.getURL(`img/${x}`));

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

const removeForeground = () => {
	let img = document.getElementById(foregroundId);
	if (img != null) {
		img.remove();
	}
};

const injectForeground = (src, opacity) => {
	removeForeground();

	const img = document.createElement('img');
	img.id = foregroundId;
	img.src = src;
	img.style = `position: fixed; top: 0; left: 0; width: 100%; height: 100vh; object-fit: cover; opacity: ${opacity}; z-index: 100; pointer-events: none;`;
	document.body.append(img);
};

const removeBackground = () => {
	let style = document.getElementById(backgroundId);
	if (style != null) {
		style.remove();
	}
};

const injectBackground = (src, opacity) => {
	removeBackground();

	const c = 255 * Number(opacity);

	const style = document.createElement('style');
	style.id = backgroundId;
	style.innerText = `
	body {
		background-image: url(${src});
		 
		background-position: center center;
		background-repeat: no-repeat;
		background-attachment: fixed;
		background-size: cover;
		background-color: rgb(${c}, ${c}, ${c});
		background-blend-mode:multiply;
	}
	`;
	document.body.append(style);
};

const update = (values) => {
	console.log(values);

	const fgInject = values.foreground.inject;
	const bgInject = values.background.inject;

	if (fgInject) {
		const src = random(bgInject ? images.slice(1) : images);
		injectForeground(src, values.foreground.opacity);
	} else {
		removeForeground();
	}
	if (bgInject) {
		const src = fgInject ? images[0] : random(images);
		injectBackground(src, values.background.opacity);
	} else {
		removeBackground();
	}
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	update(request);
	sendResponse();
});

const defaultValue = {
	foreground: {
		opacity: 0.15,
		inject: false
	},
	background: {
		opacity: 0.30,
		inject: false
	}
};

chrome.storage.local.get(defaultValue, (values) => {
	update(values);
});
