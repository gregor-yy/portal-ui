import { FC, ReactNode, useRef } from 'react';
import { Transition } from 'react-transition-group';

import { SYSTEM_TRANSITION_MS_100 } from '@/shared/constants';
import { useDialog, usePopover } from '@/shared/hooks';
import { classNames } from '@/shared/lib';
import { TPopoverPlacement } from '@/shared/types';

import { Backdrop } from '../Backdrop';
import { FloatingContainer } from '../FloatingContainer';
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

	const { floatingContainerRef } = usePopover({ isOpen, anchorEl, anchorPlacement, placement });

	useDialog({ isOpen, onClose });

	return (
		<Transition nodeRef={transitionRef} in={isOpen} timeout={SYSTEM_TRANSITION_MS_100} mountOnEnter unmountOnExit>
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
							<FloatingContainer
								id={id}
								ref={floatingContainerRef}
								isOpen={status === 'entering' || status === 'entered'}
								className={classNames(styles.body, className)}
							>
								{children}
							</FloatingContainer>
						</FocusTrap>
					</div>
				</Portal>
			)}
		</Transition>
	);
};
