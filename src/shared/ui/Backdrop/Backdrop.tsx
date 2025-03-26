import { FC, HTMLAttributes } from 'react';

import { classNames } from '@/shared/lib';

import styles from './Backdrop.module.css';

interface IBackdropProps extends HTMLAttributes<HTMLDivElement> {
	className?: string;
	onClick?: () => void;
}

export const Backdrop: FC<IBackdropProps> = ({ className, onClick, ...props }) => {
	return <div {...props} className={classNames(styles.container, className)} onClick={onClick} />;
};
