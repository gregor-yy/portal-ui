import { FC, HTMLAttributes, ReactNode, RefObject } from 'react';

import { classNames } from '@/shared/lib';

import styles from './FloatingContainer.module.css';

interface IFloatingContainerProps extends HTMLAttributes<HTMLDivElement> {
	ref: RefObject<HTMLDivElement | null>;
	isOpen: boolean;
	children: ReactNode;
}

export const FloatingContainer: FC<IFloatingContainerProps> = ({ isOpen, children, className, ...props }) => {
	return (
		<div
			{...props}
			className={classNames(
				styles.container,
				{
					[styles.enter]: isOpen,
				},
				className,
			)}
		>
			{children}
		</div>
	);
};
