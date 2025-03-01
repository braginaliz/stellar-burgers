import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store/index';

export const AppHeader: FC = () => {
  const { data } = useSelector((state) => state.user);

  return <AppHeaderUI userName={data.name} />;
};