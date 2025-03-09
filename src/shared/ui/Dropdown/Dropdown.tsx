import { Children, cloneElement, FC, isValidElement, ReactNode, useState } from 'react';

import { Portal } from '../Portal';

interface ITriggerProps {
	children: ReactNode;
	onClick: () => void;
}

export const Trigger: FC<ITriggerProps> = ({ children, onClick }) => {
	return <div onClick={onClick}>{children}</div>;
};

interface IMenuProps {
	children: ReactNode;
}

export const Menu: FC<IMenuProps> = ({ children }) => {
	return (
		<Portal>
			<div>{children}</div>
		</Portal>
	);
};

interface IItemProps {
	children: ReactNode;
}

export const Item: FC<IItemProps> = ({ children }) => {
	return <div>{children}</div>;
};

interface IDropdownProps {
	children: ReactNode;
}

export const Dropdown: FC<IDropdownProps> & {
	Trigger: typeof Trigger;
	Menu: typeof Menu;
	Item: typeof Item;
} = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div>
			{Children.map(children, (child) => {
				if (isValidElement<ITriggerProps>(child) && child.type === Trigger) {
					return cloneElement<ITriggerProps>(child, { onClick: toggleDropdown });
				}
				if (isValidElement(child) && child.type === Menu && isOpen) {
					return cloneElement(child);
				}
				return null;
			})}
		</div>
	);
};

Dropdown.Trigger = Trigger;
Dropdown.Menu = Menu;
Dropdown.Item = Item;
