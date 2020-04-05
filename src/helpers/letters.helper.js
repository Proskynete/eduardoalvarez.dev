const inviteTextToRead = 'Puedes accede al artículo desde el siguiente link: ';

export const getFirstLetter = string => string.charAt(0);
export const removeBlankSpace = string => string.replace(' ', '%20');
export const titleForSocialNetwork = string =>
	removeBlankSpace(`${string} - ${inviteTextToRead}`);
