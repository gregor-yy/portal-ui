import { FC, HTMLAttributes, ReactNode, RefObject } from 'react';

import { classNames } from '@/shared/lib';

import styles from './Overlay.module.css';

interface IOverlayProps extends HTMLAttributes<HTMLDivElement> {
	ref: RefObject<HTMLDivElement | null>;
	isOpen: boolean;
	children: ReactNode;
}

export const Overlay: FC<IOverlayProps> = ({ isOpen, children, className, ...props }) => {
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
