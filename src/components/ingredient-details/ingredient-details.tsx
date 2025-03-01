import { useSelector } from '../../services/store/index';
import { IngredientDetailsUI, Preloader } from '@ui';
import { FC } from 'react';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const ingredientData = useSelector((state) =>
    state.ingredients.data.find((ingredient) => ingredient._id === id)
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};