export const copyTextToClipboard = (e: Event, text: string): void => {
	e.preventDefault();

	const textarea = document.createElement('textarea');
	textarea.innerText = text;
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand('copy');
	textarea.remove();
};
