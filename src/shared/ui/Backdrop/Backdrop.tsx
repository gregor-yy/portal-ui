import { FC } from 'react';

import { classNames } from '@/shared/lib';

import styles from './Backdrop.module.css';

interface IBackdropProps {
	className?: string;
	onClick?: () => void;
}

export const Backdrop: FC<IBackdropProps> = ({ className, onClick }) => {
	return <div className={classNames(styles.container, className)} onClick={onClick} />;
};
