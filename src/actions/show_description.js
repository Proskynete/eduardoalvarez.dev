const SHOW_DESCRIPTION = 'SHOW_DESCRIPTION';

const showDescription = () =>
  (dispatch) => {
    dispatch({
      type: SHOW_DESCRIPTION,
      payload: '',
    });
  };
export {
  SHOW_DESCRIPTION,
  showDescription,
};
