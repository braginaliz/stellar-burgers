import React, { useEffect } from 'react';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import {
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute,
  Root
} from '@components';
import { useDispatch } from '../../services/store/index';
import { fetchUser, fetchIngredients, resetOrderModalData } from '@slices';

const App = () => {
  const dispatch = useDispatch();
  const currentLocation = useLocation();
  const navigate = useNavigate();
  
  const backgroundState = currentLocation.state as { background?: Location };

  const closeModal = () => {
    navigate(-1);
    dispatch(resetOrderModalData());
  };

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <Root>
      <>
        <Routes location={backgroundState?.background || currentLocation}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/feed/:number' element={<OrderInfo />} />
          <Route path='/ingredients/:id' element={<IngredientDetails />} />
          <Route path='/login' element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          } />
          <Route path='/register' element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          } />
          <Route path='/forgot-password' element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          } />
          <Route path='/reset-password' element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          } />
          <Route path='/profile' element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path='/profile/orders' element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          } />
          <Route path='/profile/orders/:number' element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          } />
          <Route path='*' element={<NotFound404 />} />
        </Routes>

        {backgroundState?.background && (
          <Routes>
            <Route path='/ingredients/:id' element={
              <Modal title='Детали ингредиента' onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            } />
          </Routes>
        )}
        
        {backgroundState?.background && (
          <Routes>
            <Route path='/feed/:number' element={
              <Modal title='Детали заказа' onClose={closeModal}>
                <OrderInfo />
              </Modal>
            } />
          </Routes>
        )}
        
        {backgroundState?.background && (
          <Routes>
            <Route path='/profile/orders/:number' element={
              <Modal title='Детали заказа' onClose={closeModal}>
                <OrderInfo />
              </Modal>
            } />
          </Routes>
        )}
      </>
    </Root>
  );
};

export default App;