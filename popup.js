const requestUpdate = (values) => {
	chrome.tabs.query({active:true, currentWindow:true}, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, values);
	});
}

const fgOpacity = document.getElementById('fg_opacity');
const fgInject = document.getElementById('fg_inject');
const bgOpacity = document.getElementById('bg_opacity');
const bgInject = document.getElementById('bg_inject');
const button = document.getElementById('bt_apply');

button.addEventListener('click', (ev) => {
	console.log('clicked');
	const values = {
		foreground: {
			opacity: fgOpacity.value,
			inject: fgInject.checked
		},
		background: {
			opacity: bgOpacity.value,
			inject: bgInject.checked
		}
	}
	chrome.storage.local.set(values);
	requestUpdate(values);
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
	fgOpacity.value = values.foreground.opacity;
	fgInject.checked = values.foreground.inject;
	bgOpacity.value = values.background.opacity;
	bgInject.checked = values.background.inject;
});
