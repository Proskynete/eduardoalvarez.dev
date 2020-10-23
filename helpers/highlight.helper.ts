import hljs from 'highlight.js';

export const highlightFormat = () => {
	document.querySelectorAll('pre').forEach((codeBlock) => {
		const code = codeBlock.querySelector('code');
		const headerDiv = document.createElement('div');
		const text = document.createElement('p');
		const codeContainer = document.createElement('div');

		headerDiv.classList.add('highlight__header');
		text.classList.add('highlight__header__text');
		codeContainer.classList.add('highlight__body');
		text.innerHTML = 'Código de ejemplo:';

		headerDiv.appendChild(text);
		codeBlock.classList.add('highlight');

		switch (code.classList.value) {
			case 'language-js':
			case 'language-javascript':
				codeBlock.setAttribute('data-language', 'js');
				break;
			case 'language-react':
				codeBlock.setAttribute('data-language', 'react');
				break;
			case 'language-node':
			case 'language-nodejs':
				codeBlock.setAttribute('data-language', 'node');
				break;
			case 'language-scss':
				codeBlock.setAttribute('data-language', 'scss');
				break;
			case 'language-css':
				codeBlock.setAttribute('data-language', 'css');
				break;
			case 'language-html':
				codeBlock.setAttribute('data-language', 'html');
				break;
			case 'language-bash':
			case 'language-terminal':
				codeBlock.setAttribute('data-language', 'bash');
				break;
			case 'language-markdown':
			case 'language-md':
				codeBlock.setAttribute('data-language', 'md');
				break;
			case 'language-yaml':
			case 'language-yml':
				codeBlock.setAttribute('data-language', 'yaml');
				break;
		}

		codeContainer.append(code);
		hljs.highlightBlock(codeContainer);
		codeBlock.prepend(headerDiv);
		codeBlock.append(codeContainer);
	});
};
