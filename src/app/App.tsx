import { Fragment, MouseEvent, useId, useMemo, useState } from 'react';

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
			{/* <AsyncSelectDemo /> */}
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

const SelectDemo = () => {
	const [value, setValue] = useState<string>('');
	const [searchValue, setSearchValue] = useState<string | null>(null);

	const options = [
		{ value: 'Apples', label: '🍎 Apples' },
		{ value: 'Bananas', label: '🍌 Bananas' },
		{ value: 'Broccoli', label: '🥦 Broccoli' },
		{ value: 'Carrots', label: '🥕 Carrots' },
		{ value: 'Chocolate', label: '🍫 Chocolate' },
		{ value: 'Grapes', label: '🍇 Grapes' },
	];

	const filteredOptions = useMemo(() => {
		if (!searchValue) return options;
		return options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()));
	}, [options, searchValue]);

	const handleSearch = (value: string | null) => {
		setSearchValue(value);
	};

	return (
		<Select
			value={value}
			onChange={(value) => setValue(value)}
			searchValue={searchValue}
			onSearch={handleSearch}
			placeholder="Select"
		>
			{filteredOptions.length > 0 ? (
				filteredOptions.map((option) => (
					<Select.Option key={option.value} value={option.value}>
						{option.label}
					</Select.Option>
				))
			) : (
				<Select.Option disabled>No data</Select.Option>
			)}
		</Select>
	);
};

// type User = {
// 	id: number;
// 	name: string;
// 	email: string;
// };

// const AsyncSelectDemo = () => {
// 	const [value, setValue] = useState<string>('');
// 	const [searchValue, setSearchValue] = useState<string>('');
// 	const [users, setUsers] = useState<User[]>([]);
// 	const [loading, setLoading] = useState(false);

// 	useEffect(() => {
// 		const fetchUsers = async () => {
// 			setLoading(true);
// 			try {
// 				const response = await fetch(
// 					`https://jsonplaceholder.typicode.com/users${searchValue ? `?name_like=${searchValue}` : ''}`,
// 				);
// 				const data = await response.json();
// 				setUsers(data);
// 			} catch (error) {
// 				console.error('Error fetching users:', error);
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		const timer = setTimeout(() => {
// 			fetchUsers();
// 		}, 300);

// 		return () => clearTimeout(timer);
// 	}, [searchValue]);

// 	const options = useMemo(() => {
// 		return users.map((user) => ({
// 			value: user.id.toString(),
// 			label: `${user.name} (${user.email})`,
// 		}));
// 	}, [users]);

// 	const handleSearch = (value: string) => {
// 		setSearchValue(value);
// 	};

// 	return (
// 		<Select value={value} onChange={setValue} onSearch={handleSearch} placeholder="Async Select">
// 			{loading ? (
// 				<Select.Option disabled>Loading...</Select.Option>
// 			) : options.length > 0 ? (
// 				options.map((option) => (
// 					<Select.Option key={option.value} value={option.value}>
// 						{option.label}
// 					</Select.Option>
// 				))
// 			) : (
// 				<Select.Option disabled>No data</Select.Option>
// 			)}
// 		</Select>
// 	);
// };
