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
			<MultipleSelectDemo />
			<SelectGenericDemo />
			<MultipleSelectGenericDemo />
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

const options = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate', '🍇 Grapes'];

const SelectDemo = () => {
	const [value, setValue] = useState<string>('');
	const [searchValue, setSearchValue] = useState<string | null>('');

	const filteredOptions = useMemo(() => {
		if (!searchValue) return options;
		return options.filter((option) => option.toLowerCase().includes(searchValue.toLowerCase()));
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

const MultipleSelectDemo = () => {
	const [values, setValues] = useState<string[]>([]);
	const [searchValue, setSearchValue] = useState<string | null>('');

	const filteredOptions = useMemo(() => {
		if (!searchValue) return options;
		return options.filter((option) => option.toLowerCase().includes(searchValue.toLowerCase()));
	}, [options, searchValue]);

	const handleChange = (value: string) => {
		const newValues = [...values];
		const valueIndex = newValues.findIndex((item) => item === value);
		if (valueIndex === -1) {
			newValues.push(value);
		} else {
			newValues.splice(valueIndex, 1);
		}
		setValues(newValues);
	};

	return (
		<Select
			multiple
			options={filteredOptions}
			value={values}
			onChange={handleChange}
			searchValue={searchValue}
			onSearch={setSearchValue}
			placeholder="Multiple Select"
		/>
	);
};

type TSelectGenericOption = { name: string; label: string };

const SelectGenericDemo = () => {
	const [value, setValue] = useState<TSelectGenericOption>();
	return (
		<Select<TSelectGenericOption>
			options={[
				{ name: 'Apples', label: '🍎 Apples' },
				{ name: 'Bananas', label: '🍌 Bananas' },
				{ name: 'Broccoli', label: '🥦 Broccoli' },
			]}
			renderValue={(value) => value.label}
			getOptionValue={(option) => option.name}
			getOptionLabel={(option) => option.label}
			value={value}
			onChange={setValue}
			placeholder="Select Generic"
		/>
	);
};

const MultipleSelectGenericDemo = () => {
	const [values, setValues] = useState<TSelectGenericOption[]>([]);

	const handleChange = (value: TSelectGenericOption) => {
		const newValues = [...values];
		const valueIndex = newValues.findIndex((item) => item.name === value.name);
		if (valueIndex === -1) {
			newValues.push(value);
		} else {
			newValues.splice(valueIndex, 1);
		}
		setValues(newValues);
	};

	return (
		<Select<TSelectGenericOption>
			multiple
			options={[
				{ name: 'Apples', label: '🍎 Apples' },
				{ name: 'Bananas', label: '🍌 Bananas' },
				{ name: 'Broccoli', label: '🥦 Broccoli' },
			]}
			renderValue={(value) => value.map((item) => item.label).join(', ')}
			getOptionValue={(option) => option.name}
			getOptionLabel={(option) => option.label}
			value={values}
			onChange={handleChange}
			placeholder="Multiple Select Generic"
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
	const [value, setValue] = useState<User>();
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

	return (
		<Select<User>
			isOpen={isOpen}
			onOpenChange={setIsOpen}
			value={value}
			options={users}
			renderValue={(option) => option.name}
			getOptionValue={(option) => option.id.toString()}
			getOptionLabel={(option) => option.name}
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
