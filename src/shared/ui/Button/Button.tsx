import { ButtonHTMLAttributes, FC, ReactNode } from 'react';

import { classNames } from '@/shared/lib';

import styles from './Button.module.css';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
}

export const Button: FC<IButtonProps> = ({ className, children, ...props }) => {
	return (
		<button className={classNames(styles.container, className)} {...props}>
			{children}
		</button>
	);
};
