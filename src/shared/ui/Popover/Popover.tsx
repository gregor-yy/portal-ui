import { FC, ReactNode, useRef } from 'react';
import { Transition } from 'react-transition-group';

import { ETransition } from '@/shared/constants';
import { useDialog, usePopover } from '@/shared/hooks';
import { classNames } from '@/shared/lib';
import { TPopoverPlacement } from '@/shared/types';

import { Backdrop } from '../Backdrop';
import { FocusTrap } from '../FocusTrap';
import { Portal } from '../Portal';

import styles from './Popover.module.css';

interface IPopoverProps {
	id?: string;
	isOpen: boolean;
	onClose?: () => void;
	anchorEl: HTMLElement | null;
	children: ReactNode;
	anchorPlacement?: TPopoverPlacement;
	placement?: TPopoverPlacement;
	className?: string;
}

export const Popover: FC<IPopoverProps> = ({
	id,
	isOpen,
	onClose,
	anchorEl,
	children,
	anchorPlacement = 'bottom-center',
	placement = 'bottom-center',
	className,
}) => {
	const transitionRef = useRef<HTMLDivElement | null>(null);

	const { overlayRef } = usePopover({ isOpen, anchorEl, anchorPlacement, placement });

	useDialog({ isOpen, onClose });

	return (
		<Transition nodeRef={transitionRef} in={isOpen} timeout={ETransition.TRANSITION_100} mountOnEnter unmountOnExit>
			{(status) => (
				<Portal>
					<div
						className={classNames(styles.container, {
							[styles.enter]: status === 'entering' || status === 'entered',
						})}
						ref={transitionRef}
					>
						<Backdrop className={styles.backdrop} onClick={onClose} />
						<FocusTrap>
							<div
								id={id}
								ref={overlayRef}
								className={classNames(
									styles.body,
									styles[placement],
									{
										[styles.enter]: status === 'entering' || status === 'entered',
									},
									className,
								)}
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
