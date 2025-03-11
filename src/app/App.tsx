import { Fragment, MouseEvent, useId, useState } from 'react';

import { Drawer, Dropdown, Modal, Popover, Tooltip } from '@/shared/ui';

import styles from './App.module.css';

export const App = () => {
	return (
		<div className={styles.container}>
			<ModalDemo />
			<DrawerDemo />
			<TooltipDemo />
			<PopoverDemo />
			<DropdownDemo />
		</div>
	);
};

const ModalDemo = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	return (
		<Fragment>
			<button className={styles.button} onClick={() => setIsModalOpen(true)}>
				Open Modal
			</button>
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
			<button className={styles.button} onClick={() => setIsDrawerOpen(true)}>
				Open Drawer
			</button>
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
			<button className={styles.button}>Open Tooltip</button>
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
			<button id={buttonAriaDescribedbyId} className={styles.button} onClick={handleOpen}>
				Open Popover
			</button>
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
				<button className={styles.button}>Open Dropdown</button>
			</Dropdown.Trigger>
			<Dropdown.Menu>
				<Dropdown.Item>Profile</Dropdown.Item>
				<Dropdown.Item>My account</Dropdown.Item>
				<Dropdown.Item>Logout</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
};
