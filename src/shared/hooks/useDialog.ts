import { useEffect, useId, useLayoutEffect } from 'react';

import { useSelector, useUpdate } from '../store';

interface UseDialogStackProps {
	isOpen: boolean;
	onClose?: () => void;
}

export const useDialog = ({ isOpen, onClose }: UseDialogStackProps) => {
	const id = useId();
	const stack = useSelector((store) => store.dialogStack);
	const update = useUpdate();

	useEffect(() => {
		if (!isOpen) return;

		update({ dialogStack: [...stack, id] });

		return () => update({ dialogStack: stack.filter((item) => item !== id) });
	}, [isOpen, id, update]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && isOpen && onClose) {
				if (stack[stack.length - 1] === id) {
					onClose();
				}
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, onClose, stack, id]);

	useLayoutEffect(() => {
		if (!isOpen) return;

		const previousOverflow = document.body.style.overflow;

		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [isOpen]);
};
