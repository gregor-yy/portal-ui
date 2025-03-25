import { FC, ReactNode, useRef } from 'react';
import { Transition } from 'react-transition-group';

import { SYSTEM_TRANSITION_MS_100 } from '@/shared/constants';
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
	const containerRef = useRef<HTMLDivElement | null>(null);

	useDialog({ isOpen, onClose });

	return (
		<Transition timeout={SYSTEM_TRANSITION_MS_100} nodeRef={containerRef} in={isOpen} mountOnEnter unmountOnExit>
			{(status) => (
				<Portal>
					<div
						className={classNames(styles.container, {
							[styles.enter]: status === 'entering' || status === 'entered',
						})}
						ref={containerRef}
					>
						<Backdrop className={classes?.backdrop} onClick={onClose} />
						<FocusTrap>
							<div className={classNames(styles.body, classes?.body)}>{children}</div>
						</FocusTrap>
					</div>
				</Portal>
			)}
		</Transition>
	);
};
