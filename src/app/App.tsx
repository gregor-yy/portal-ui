import { useState } from 'react';

import { Modal } from '@/shared/ui';

import styles from './App.module.css';

export const App = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	return (
		<div className={styles.container}>
			<button className={styles.button} onClick={() => setIsModalOpen(true)}>
				Open Modal
			</button>
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				Modal
				<SubModal />
			</Modal>
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
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				Sub modal
			</Modal>
		</div>
	);
};
