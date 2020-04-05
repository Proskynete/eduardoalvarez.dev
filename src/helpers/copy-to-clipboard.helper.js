export const copyTextToClipboard = (e, string) => {
	e.preventDefault();

	const textarea = document.createElement('textarea');
	textarea.innerText = string;
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand('copy');
	textarea.remove();
};
