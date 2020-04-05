/* eslint-disable react/no-danger */
import React from 'react';

export const createMarkup = text => ({ __html: text });
export const printHtmlInSelector = text => (
	<span dangerouslySetInnerHTML={createMarkup(text)} />
);
