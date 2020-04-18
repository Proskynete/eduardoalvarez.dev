export const highlightFormat = () => {
	setTimeout(() => {
		document.querySelectorAll('pre').forEach(codeBlock => {
			const code = codeBlock.querySelector('code');
			codeBlock.classList.add('highlight');

			switch (code.classList.value) {
				case 'language-js':
				case 'language-javascript':
					codeBlock.setAttribute('data-language', 'js');
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
			}
			hljs.highlightBlock(codeBlock);
		});
	}, 1);
};
