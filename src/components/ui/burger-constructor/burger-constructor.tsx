import React, { FC } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  orderRequest,
  price,
  orderModalData,
  onOrderClick,
  closeOrderModal,
}) => {
  const bunTop = constructorItems.bun ? (
    <div className={`${styles.element} mb-4 mr-4`}>
      <ConstructorElement
        type='top'
        isLocked
        text={`${constructorItems.bun.name} (верх)`}
        price={constructorItems.bun.price}
        thumbnail={constructorItems.bun.image}
      />
    </div>
  ) : (
    <div className={`${styles.noBuns} ${styles.noBunsTop} ml-8 mb-4 mr-5 text text_type_main-default`}>
      Выберите булки
    </div>
  );

  const ingredientList = constructorItems.ingredients.length > 0 ? (
    constructorItems.ingredients.map((item: TConstructorIngredient, index: number) => (
      <BurgerConstructorElement
        ingredient={item}
        index={index}
        totalItems={constructorItems.ingredients.length}
        key={item.id}
      />
    ))
  ) : (
    <div className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}>
      Выберите начинку
    </div>
  );

  const bunBottom = constructorItems.bun ? (
    <div className={`${styles.element} mt-4 mr-4`}>
      <ConstructorElement
        type='bottom'
        isLocked
        text={`${constructorItems.bun.name} (низ)`}
        price={constructorItems.bun.price}
        thumbnail={constructorItems.bun.image}
      />
    </div>
  ) : (
    <div className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}>
      Выберите булки
    </div>
  );

  return (
    <section className={styles.burger_constructor}>
      {bunTop}
      <ul className={styles.elements}>
        {ingredientList}
      </ul>
      {bunBottom}
      <div className={`${styles.total} mt-10 mr-4`}>
        <div className={`${styles.cost} mr-10`}>
          <p className={`text ${styles.text} mr-2`}>{price}</p>
          <CurrencyIcon type='primary' />
        </div>
        <Button
          data-order-button
          htmlType='button'
          type='primary'
          size='large'
          onClick={onOrderClick}
          disabled={!constructorItems.bun || constructorItems.ingredients.length === 0}
        >
          Оформить заказ
        </Button>
      </div>
      {orderRequest && (
        <Modal onClose={closeOrderModal} title={'Оформляем заказ...'}>
          <Preloader />
        </Modal>
      )}
      {orderModalData && (
        <Modal onClose={closeOrderModal} title={orderRequest ? 'Оформляем заказ...' : ''}>
          <OrderDetailsUI orderNumber={orderModalData.number} />
        </Modal>
      )}
    </section>
  );
};

export default BurgerConstructorUI;