import { useState } from 'react';

import { Drawer, Modal } from '@/shared/ui';

import styles from './App.module.css';

export const App = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	return (
		<div className={styles.container}>
			<button className={styles.button} onClick={() => setIsModalOpen(true)}>
				Open Modal
			</button>
			<button className={styles.button} onClick={() => setIsDrawerOpen(true)}>
				Open Drawer
			</button>
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				Modal
				<SubModal />
			</Modal>
			<Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
				Drawer
				<TopDrawer />
			</Drawer>
		</div>
	);
};

const SubModal = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	return (
		<div>
			<button className={styles.button} onClick={() => setIsModalOpen(true)}>
				open sub model
			</button>
			<button className={styles.button} onClick={() => setIsModalOpen(true)}>
				open sub model
			</button>
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				Sub modal
				<TopDrawer />
			</Modal>
		</div>
	);
};

const TopDrawer = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	return (
		<div>
			<button className={styles.button} onClick={() => setIsDrawerOpen(true)}>
				open Top Drawer
			</button>
			<Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} anchor="top">
				Top Drawer
				<RightDrawer />
			</Drawer>
		</div>
	);
};

const RightDrawer = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	return (
		<div>
			<button className={styles.button} onClick={() => setIsDrawerOpen(true)}>
				open Right Drawer
			</button>
			<Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} anchor="right">
				Right Drawer
				<BottomDrawer />
			</Drawer>
		</div>
	);
};

const BottomDrawer = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	return (
		<div>
			<button className={styles.button} onClick={() => setIsDrawerOpen(true)}>
				open Bottom Drawer
			</button>
			<Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} anchor="bottom">
				Bottom Drawer
				<button className={styles.button} onClick={() => setIsDrawerOpen(true)}>
					open Bottom Drawer
				</button>
				<button className={styles.button} onClick={() => setIsDrawerOpen(true)}>
					open Bottom Drawer
				</button>
				<button className={styles.button} onClick={() => setIsDrawerOpen(true)}>
					open Bottom Drawer
				</button>
			</Drawer>
		</div>
	);
};
