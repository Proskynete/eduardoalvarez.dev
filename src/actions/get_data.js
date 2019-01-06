import config from '../config/config';

const SHOW_ARTICLES = 'SHOW_ARTICLES';
const SHOW_DETAILS = 'SHOW_DETAILS';

const context = config.handleGetUrl();

const showData = dispatch =>
    (id = false) => {
        const uri = id || '';
        const url = `${context}${config.handleGetEntryPointApi()}${uri}`;
        
        fetch(url)
            .then((response) => {
                response.json()
                    .then((data) => {
                        const type = id ? SHOW_DETAILS : SHOW_ARTICLES;
                        const payload = id ? data.description : data.articles;
                        dispatch({
                            type,
                            payload,
                        });
                    });
            });
  };

export {
    SHOW_ARTICLES,
    SHOW_DETAILS,
    showData,
};
