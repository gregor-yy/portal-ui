import { FC, MouseEvent, ReactElement, ReactNode, useId, useRef } from 'react';
import { Transition } from 'react-transition-group';

import { SYSTEM_TRANSITION_MS_100 } from '@/shared/constants';
import { useDialog, usePopover } from '@/shared/hooks';
import { classNames, createOptimizedContext } from '@/shared/lib';
import { TPopoverPlacement } from '@/shared/types';

import { Backdrop } from '../Backdrop';
import { FloatingContainer } from '../FloatingContainer';
import { FocusTrap } from '../FocusTrap';
import { Portal } from '../Portal';

import styles from './Dropdown.module.css';

type TDropdownContextData = {
	triggerId: string;
	anchorEl: HTMLElement | null;
};

const { Provider, useSelector, useUpdate } = createOptimizedContext<TDropdownContextData>();

type TTriggerChildrenProps = {
	triggerId: string;
	handleOpen: (event: MouseEvent<HTMLElement>) => void;
};

interface ITriggerProps {
	children: (props: TTriggerChildrenProps) => ReactElement;
}

const Trigger: FC<ITriggerProps> = ({ children }) => {
	const { triggerId } = useSelector((store) => store);
	const update = useUpdate();

	const handleOpen = (event: MouseEvent<HTMLElement>) => update({ anchorEl: event.currentTarget });

	return children({ triggerId, handleOpen });
};

type TTrigger = typeof Trigger;

interface IItemProps {
	children: ReactNode;
	onClick?: () => void;
	className?: string;
}

const Item: FC<IItemProps> = ({ children, onClick, className }) => {
	const update = useUpdate();

	const handleSelect = () => {
		if (onClick) onClick();
		update({ anchorEl: null });
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

type TItem = typeof Item;

type IMenuChild = ReactElement<TItem>;

interface IMenuProps {
	isOpen?: boolean;
	children: IMenuChild | IMenuChild[];
	anchorPlacement?: TPopoverPlacement;
	placement?: TPopoverPlacement;
	className?: string;
}

const Menu: FC<IMenuProps> = ({
	isOpen: isOpenProp = false,
	children,
	anchorPlacement = 'bottom-center',
	placement = 'bottom-center',
	className,
}) => {
	const transitionRef = useRef<HTMLDivElement | null>(null);

	const { triggerId, anchorEl } = useSelector((store) => store);
	const update = useUpdate();

	const isOpen = isOpenProp || !!anchorEl;

	const handleClose = () => {
		update({ anchorEl: null });
	};

	const { floatingContainerRef } = usePopover({ isOpen, anchorEl, anchorPlacement, placement });

	useDialog({ isOpen, onClose: handleClose });

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
						<Backdrop className={styles.backdrop} onClick={handleClose} />
						<FocusTrap>
							<FloatingContainer
								ref={floatingContainerRef}
								isOpen={status === 'entering' || status === 'entered'}
								className={classNames(styles.body, className)}
							>
								<ul role="menu" aria-labelledby={triggerId}>
									{children}
								</ul>
							</FloatingContainer>
						</FocusTrap>
					</div>
				</Portal>
			)}
		</Transition>
	);
};

type TMenu = typeof Menu;

type TDropdownChild = ReactElement<TTrigger> | ReactElement<TMenu>;

interface IDropdownProps {
	children: TDropdownChild | TDropdownChild[];
}

export const Dropdown: FC<IDropdownProps> & {
	Trigger: TTrigger;
	Menu: TMenu;
	Item: TItem;
} = ({ children }) => {
	const triggerId = useId();

	return <Provider initialState={{ triggerId, anchorEl: null }}>{children}</Provider>;
};

Dropdown.Trigger = Trigger;
Dropdown.Menu = Menu;
Dropdown.Item = Item;
