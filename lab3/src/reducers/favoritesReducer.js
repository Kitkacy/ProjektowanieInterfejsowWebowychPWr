export const FAVORITES_ACTIONS = {
  SET_FAVORITES: 'SET_FAVORITES',
  SET_FAVORITE_IDS: 'SET_FAVORITE_IDS',
  ADD_FAVORITE: 'ADD_FAVORITE',
  REMOVE_FAVORITE: 'REMOVE_FAVORITE',
  RESET_FAVORITES: 'RESET_FAVORITES',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

export const initialFavoritesState = {
  favorites: [],
  favoriteIds: [],
  loading: false,
  error: null
};

export function favoritesReducer(state, action) {
  switch (action.type) {
    case FAVORITES_ACTIONS.SET_FAVORITES:
      return {
        ...state,
        favorites: action.payload,
        error: null
      };

    case FAVORITES_ACTIONS.SET_FAVORITE_IDS:
      return {
        ...state,
        favoriteIds: action.payload,
        error: null
      };

    case FAVORITES_ACTIONS.ADD_FAVORITE:
      const bookId = action.payload;
      if (state.favoriteIds.includes(bookId)) {
        return state; 
      }
      return {
        ...state,
        favoriteIds: [...state.favoriteIds, bookId],
        error: null
      };

    case FAVORITES_ACTIONS.REMOVE_FAVORITE:
      const removeBookId = action.payload;
      return {
        ...state,
        favoriteIds: state.favoriteIds.filter(id => id !== removeBookId),
        favorites: state.favorites.filter(book => book.id !== removeBookId),
        error: null
      };

    case FAVORITES_ACTIONS.RESET_FAVORITES:
      return {
        ...state,
        favorites: [],
        favoriteIds: [],
        error: null
      };

    case FAVORITES_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case FAVORITES_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    default:
      return state;
  }
}
