const inviteTextToRead = 'Puedes accede al artículo desde el siguiente link: ';

export const getFirstLetter = (text: string) => text.charAt(0);
export const removeBlankSpace = (text: string) => text.replace(' ', '%20');
export const titleForSocialNetwork = (text: string) =>
	removeBlankSpace(`${text} - ${inviteTextToRead}`);

export const clearString = (text: string) => {
	return text
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[¿?]/g, '')
		.toLowerCase();
};

export const replaceSpaceForUnderscore = (text: string) =>
	text.replace(/ /g, '_');
