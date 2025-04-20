import { FC } from 'react';

import { classNames } from '@/shared/lib';

import styles from './Loader.module.css';

interface ILoaderProps {
	className?: string;
}

export const Loader: FC<ILoaderProps> = ({ className }) => {
	return (
		<svg className={classNames(styles.container, className)} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<g>
				<circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3"></circle>
			</g>
		</svg>
	);
};
