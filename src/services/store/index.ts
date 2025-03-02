import { 
  TypedUseSelectorHook, 
  useDispatch as reduxUseDispatch, 
  useSelector as reduxUseSelector 
} from 'react-redux';
import { configureStore, combineReducers, Middleware } from '@reduxjs/toolkit';

import ingredientsReducer from '../slices/ingridients';
import feedsReducer from '../slices/feeds';
import userReducer from '../slices/user';
import builderReducer from '../slices/builder';
import ordersReducer from '../slices/orders';

import ordersMiddleware from '../middlewares';


const rootReducer = combineReducers({
  user: userReducer,
  builder: builderReducer,
  ingredients: ingredientsReducer,
  feeds: feedsReducer,
  orders: ordersReducer,
});

// Конфиг Redux
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(ordersMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// типы состояния корневого редюсера и диспетчера приложения
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// типизированные хуки 
const useDispatch: () => AppDispatch = reduxUseDispatch;
const useSelector: TypedUseSelectorHook<RootState> = reduxUseSelector;


export { store, useDispatch, useSelector};