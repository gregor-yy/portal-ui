import { FC, ReactNode, useRef } from 'react';
import { Transition } from 'react-transition-group';

import { useDialog } from '@/shared/hooks';
import { classNames } from '@/shared/lib';

import { Backdrop } from '../Backdrop';
import { FocusTrap } from '../FocusTrap';
import { Portal } from '../Portal';

import styles from './Drawer.module.css';

type TDrawerClasses = {
	body?: string;
	backdrop?: string;
};

type TDrawerAnchor = 'left' | 'right' | 'top' | 'bottom';

interface DrawerProps {
	isOpen: boolean;
	onClose?: () => void;
	children: ReactNode;
	anchor?: TDrawerAnchor;
	classes?: TDrawerClasses;
}

export const Drawer: FC<DrawerProps> = ({ isOpen, onClose, children, classes, anchor = 'left' }) => {
	const transitionRef = useRef(null);

	useDialog({ isOpen, onClose });

	return (
		<Transition nodeRef={transitionRef} in={isOpen} timeout={500} mountOnEnter unmountOnExit>
			{(status) => (
				<Portal>
					<div
						className={classNames(styles.container, {
							[styles.enter]: status === 'entering' || status === 'entered',
						})}
						ref={transitionRef}
					>
						<Backdrop className={classes?.backdrop} onClick={onClose} />
						<FocusTrap>
							<div
								className={classNames(styles.body, classes?.body, styles[anchor], {
									[styles.enter]: status === 'entering' || status === 'entered',
								})}
							>
								{children}
							</div>
						</FocusTrap>
					</div>
				</Portal>
			)}
		</Transition>
	);
};
