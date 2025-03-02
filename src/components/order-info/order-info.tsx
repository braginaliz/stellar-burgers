import { FC, useEffect, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store/index';
import { OrderInfoUI, Preloader } from '@ui';
import { useParams } from 'react-router-dom';
import { fetchOrder } from '@slices';

export const OrderInfo: FC = () => {
    const dispatch = useDispatch();
    const { number } = useParams<{ number: string }>();

    const { isLoading: isIngredientsLoading, data: ingredients } = useSelector(state => state.ingredients);
    const { isOrderLoading, orderModalData: orderData } = useSelector(state => state.orders);

    useEffect(() => {
        dispatch(fetchOrder(Number(number)));
    }, [dispatch, number]);

    const orderInfo = useMemo(() => {
        if (!orderData || !ingredients.length) return null;

        const date = new Date(orderData.createdAt);
        type TIngredientsWithCount = { [key: string]: TIngredient & { count: number } };

        const ingredientsInfo = orderData.ingredients.reduce((acc: TIngredientsWithCount, item) => {
            if (!acc[item]) {
                const ingredient = ingredients.find(ing => ing._id === item);
                if (ingredient) {
                    acc[item] = { ...ingredient, count: 1 };
                }
            } else {
                acc[item].count++;
            }
            return acc;
        }, {});

        const total = Object.values(ingredientsInfo).reduce((acc, item) => acc + item.price * item.count, 0);

        return { ...orderData, ingredientsInfo, date, total };
    }, [orderData, ingredients]);

    if (isIngredientsLoading || isOrderLoading) {
        return <Preloader />;
    }

    if (!orderInfo) {
        return null;
    }

    return <OrderInfoUI orderInfo={orderInfo} />;
};