import {
	Children,
	cloneElement,
	FC,
	Fragment,
	isValidElement,
	MouseEvent,
	ReactNode,
	useId,
	useRef,
	useState,
} from 'react';
import { Transition } from 'react-transition-group';

import { ETransition } from '@/shared/constants';
import { useDialog, usePopover } from '@/shared/hooks';
import { classNames } from '@/shared/lib';
import { TPopoverPlacement } from '@/shared/types';

import { Backdrop } from '../Backdrop';
import { FocusTrap } from '../FocusTrap';
import { Overlay } from '../Overlay';
import { Portal } from '../Portal';

import styles from './Dropdown.module.css';

interface ITriggerProps {
	id?: string;
	children: ReactNode;
	onClick?: (event: MouseEvent<HTMLElement>) => void;
}

export const Trigger: FC<ITriggerProps> = ({ id, children, onClick }) => {
	return (
		<div id={id} onClick={onClick}>
			{children}
		</div>
	);
};

interface IItemProps {
	children: ReactNode;
	onClick?: () => void;
	onClose?: () => void;
	className?: string;
}

export const Item: FC<IItemProps> = ({ children, onClose, onClick, className }) => {
	const handleSelect = () => {
		if (onClose) onClose();
		if (onClick) onClick();
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleSelect();
		}
	};
	return (
		<li
			tabIndex={0}
			role="menuitem"
			className={classNames(styles.item, className)}
			onKeyDown={handleKeyDown}
			onClick={handleSelect}
		>
			{children}
		</li>
	);
};

interface IMenuProps {
	triggerId?: string;
	isOpen?: boolean;
	onClose?: () => void;
	anchorEl?: HTMLElement | null;
	children: ReactNode;
	anchorPlacement?: TPopoverPlacement;
	placement?: TPopoverPlacement;
	className?: string;
}

export const Menu: FC<IMenuProps> = ({
	triggerId,
	isOpen = false,
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
							<Overlay
								ref={overlayRef}
								isOpen={status === 'entering' || status === 'entered'}
								className={classNames(styles.body, className)}
							>
								<ul role="menu" aria-labelledby={triggerId}>
									{Children.map(children, (child) => {
										if (isValidElement<IItemProps>(child) && child.type === Item) {
											return cloneElement<IItemProps>(child, { onClick: onClose });
										}
										return child;
									})}
								</ul>
							</Overlay>
						</FocusTrap>
					</div>
				</Portal>
			)}
		</Transition>
	);
};

interface IDropdownProps {
	children: ReactNode;
}

export const Dropdown: FC<IDropdownProps> & {
	Trigger: typeof Trigger;
	Menu: typeof Menu;
	Item: typeof Item;
} = ({ children }) => {
	const triggerId = useId();
	const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null);

	const handleOpen = (event: MouseEvent<HTMLElement>) => {
		setPopoverAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setPopoverAnchorEl(null);
	};

	return (
		<Fragment>
			{Children.map(children, (child) => {
				if (isValidElement<ITriggerProps>(child) && child.type === Trigger) {
					return cloneElement<ITriggerProps>(child, { id: triggerId, onClick: handleOpen });
				}
				if (isValidElement<IMenuProps>(child) && child.type === Menu) {
					return cloneElement<IMenuProps>(child, {
						isOpen: !!popoverAnchorEl,
						anchorEl: popoverAnchorEl,
						onClose: handleClose,
						triggerId,
					});
				}
				return null;
			})}
		</Fragment>
	);
};

Dropdown.Trigger = Trigger;
Dropdown.Menu = Menu;
Dropdown.Item = Item;
