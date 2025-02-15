import { FC, ReactNode } from 'react';
import { Transition } from 'react-transition-group';

import { useDialog } from '@/shared/hooks';
import { classNames } from '@/shared/lib';

import { Backdrop } from '../Backdrop';
import { Portal } from '../Portal';

import styles from './Modal.module.css';

type TModalClasses = {
	body?: string;
	backdrop?: string;
};

interface ModalProps {
	isOpen: boolean;
	onClose?: () => void;
	children: ReactNode;
	classes?: TModalClasses;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, children, classes }) => {
	const { transitionRef } = useDialog({ isOpen, onClose });

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
						<div
							className={classNames(styles.body, classes?.body)}
							onClick={(event) => event.stopPropagation()}
						>
							{children}
						</div>
					</div>
				</Portal>
			)}
		</Transition>
	);
};
