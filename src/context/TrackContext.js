import createDataContext from './createDataContext';
import trackerApi from '../api/tracker';

// track reducer for displaying navigation headers
const trackReducer = (state, action) => {
  switch (action.type) {
    case 'fetch_tracks':
      return action.payload;
    default:
      return state;
  }
};

const fetchTracks = dispatch => async () => {
  const response = await trackerApi.get('/tracks');
  dispatch({ type: 'fetch_tracks', payload: response.data });
};
const createTrack = dispatch => async (name, locations) => {
  await trackerApi.post('/tracks', { name, locations });
};

// compiles provider and context to instantiate reducer
export const { Provider, Context } = createDataContext(
  trackReducer,
  { fetchTracks, createTrack },
  []
);
