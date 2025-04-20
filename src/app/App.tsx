import { Fragment, MouseEvent, useEffect, useId, useMemo, useState } from 'react';

import { Button, Drawer, Dropdown, Modal, Popover, Select, Tooltip } from '@/shared/ui';

import styles from './App.module.css';

export const App = () => {
	return (
		<div className={styles.container}>
			<ModalDemo />
			<DrawerDemo />
			<TooltipDemo />
			<PopoverDemo />
			<DropdownDemo />
			<SelectDemo />
			<AsyncSelectDemo />
		</div>
	);
};

const ModalDemo = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	return (
		<Fragment>
			<Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<p style={{ maxWidth: '300px' }}>
					Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ut, aperiam reprehenderit, libero aliquid
					inventore similique provident quasi velit sit omnis cupiditate debitis quo nihil! Tenetur nemo autem
					hic dicta id.
				</p>
			</Modal>
		</Fragment>
	);
};

const DrawerDemo = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	return (
		<Fragment>
			<Button className={styles.button} onClick={() => setIsDrawerOpen(true)}>
				Open Drawer
			</Button>
			<Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
				<p style={{ maxWidth: '300px' }}>
					Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ut, aperiam reprehenderit, libero aliquid
					inventore similique provident quasi velit sit omnis cupiditate debitis quo nihil! Tenetur nemo autem
					hic dicta id.
				</p>
			</Drawer>
		</Fragment>
	);
};

const TooltipDemo = () => {
	return (
		<Tooltip content="I am Tooltip!!!" isArrowShow>
			{({ onMouseEnter, onMouseLeave, onFocus, onBlur }) => (
				<Button onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onFocus={onFocus} onBlur={onBlur}>
					Open Tooltip
				</Button>
			)}
		</Tooltip>
	);
};

const PopoverDemo = () => {
	const buttonAriaDescribedbyId = useId();

	const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLButtonElement | null>(null);

	const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
		setPopoverAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setPopoverAnchorEl(null);
	};

	const isPopoverOpen = Boolean(popoverAnchorEl);

	return (
		<Fragment>
			<Button id={buttonAriaDescribedbyId} onClick={handleOpen}>
				Open Popover
			</Button>
			<Popover
				id={buttonAriaDescribedbyId}
				isOpen={isPopoverOpen}
				anchorEl={popoverAnchorEl}
				onClose={handleClose}
			>
				<p style={{ maxWidth: '300px' }}>
					Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ut, aperiam reprehenderit, libero aliquid
					inventore similique provident quasi velit sit omnis cupiditate debitis quo nihil! Tenetur nemo autem
					hic dicta id.
				</p>
			</Popover>
		</Fragment>
	);
};

const DropdownDemo = () => {
	return (
		<Dropdown>
			<Dropdown.Trigger>
				{({ triggerId, handleOpen }) => (
					<Button className={styles.button} id={triggerId} onClick={handleOpen}>
						Open Dropdown
					</Button>
				)}
			</Dropdown.Trigger>
			<Dropdown.Menu>
				<Dropdown.Item>Profile</Dropdown.Item>
				<Dropdown.Item>My account</Dropdown.Item>
				<Dropdown.Item>Logout</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
};

const options = [
	{ value: 'Apples', label: '🍎 Apples' },
	{ value: 'Bananas', label: '🍌 Bananas' },
	{ value: 'Broccoli', label: '🥦 Broccoli' },
	{ value: 'Carrots', label: '🥕 Carrots' },
	{ value: 'Chocolate', label: '🍫 Chocolate' },
	{ value: 'Grapes', label: '🍇 Grapes' },
];

const SelectDemo = () => {
	const [value, setValue] = useState<string>('');
	const [searchValue, setSearchValue] = useState<string | null>('');

	const filteredOptions = useMemo(() => {
		if (!searchValue) return options;
		return options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()));
	}, [options, searchValue]);

	return (
		<Select
			options={filteredOptions}
			value={value}
			onChange={setValue}
			searchValue={searchValue}
			onSearch={setSearchValue}
			placeholder="Select"
		/>
	);
};

const fetchUsers = (nameLike: string | null, signal: AbortSignal) => {
	return fetch(`https://jsonplaceholder.typicode.com/users${nameLike ? `?name_like=${nameLike}` : ''}`, {
		signal,
	}).then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	});
};

enum EStatus {
	LOADING = 'LOADING',
	SUCCESS = 'SUCCESS',
	ERROR = 'ERROR',
}

type User = {
	id: number;
	name: string;
	email: string;
};

const AsyncSelectDemo = () => {
	const [value, setValue] = useState<string>('');
	const [searchValue, setSearchValue] = useState<string | null>(null);
	const [users, setUsers] = useState<User[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [status, setStatus] = useState<EStatus>(EStatus.SUCCESS);

	useEffect(() => {
		if (isOpen) {
			setStatus(EStatus.LOADING);
			const controller = new AbortController();

			fetchUsers(searchValue, controller.signal)
				.then((data) => {
					setUsers(data);
					setStatus(EStatus.SUCCESS);
				})
				.catch(() => {
					if (controller.signal.aborted) return;
					else setStatus(EStatus.ERROR);
				});

			return () => {
				controller.abort();
			};
		}
	}, [isOpen, searchValue]);

	const options = useMemo(() => {
		return users.map((user) => ({
			value: user.name,
			label: `${user.name} (${user.email})`,
		}));
	}, [users]);

	return (
		<Select
			isOpen={isOpen}
			onOpenChange={setIsOpen}
			value={value}
			options={options}
			onChange={setValue}
			searchValue={searchValue}
			onSearch={setSearchValue}
			placeholder="Async Select"
			loading={status === EStatus.LOADING}
			notFoundMessage="Not found ☹️"
			dropdownError={status === EStatus.ERROR && 'Something went wrong'}
		/>
	);
};
