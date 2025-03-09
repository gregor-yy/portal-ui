import { FC, ReactNode, useRef } from 'react';
import { Transition } from 'react-transition-group';

import { ETransition } from '@/shared/constants';
import { useDialog } from '@/shared/hooks';
import { classNames } from '@/shared/lib';

import { Backdrop } from '../Backdrop';
import { FocusTrap } from '../FocusTrap';
import { Portal } from '../Portal';

import styles from './Modal.module.css';

type TModalClasses = {
	body?: string;
	backdrop?: string;
};

interface IModalProps {
	isOpen: boolean;
	onClose?: () => void;
	children: ReactNode;
	classes?: TModalClasses;
}

export const Modal: FC<IModalProps> = ({ isOpen, onClose, children, classes }) => {
	const transitionRef = useRef<HTMLDivElement | null>(null);

	useDialog({ isOpen, onClose });

	return (
		<Transition timeout={ETransition.TRANSITION_100} nodeRef={transitionRef} in={isOpen} mountOnEnter unmountOnExit>
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
								className={classNames(styles.body, classes?.body)}
								onClick={(event) => event.stopPropagation()}
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
