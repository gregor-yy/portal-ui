import { FC, InputHTMLAttributes } from 'react';

import { classNames } from '@/shared/lib';

import styles from './Input.module.css';

export const Input: FC<InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => {
	return <input className={classNames(styles.container, className)} {...props} />;
};
