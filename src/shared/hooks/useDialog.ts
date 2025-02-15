import { useEffect, useMemo, useRef } from 'react';

import { generateId } from '../lib';
import { useSelector, useUpdate } from '../store';

interface UseDialogStackProps {
	isOpen: boolean;
	onClose?: () => void;
}

export const useDialog = ({ isOpen, onClose }: UseDialogStackProps) => {
	const transitionRef = useRef<HTMLDivElement | null>(null);
	const id = useMemo(() => generateId(), []);
	const stack = useSelector((store) => store.dialogStack);
	const update = useUpdate();

	useEffect(() => {
		if (isOpen) {
			update({ dialogStack: [...stack, id] });
		}
	}, [isOpen, id, update]);

	useEffect(() => {
		return () => {
			if (isOpen) {
				update({ dialogStack: stack.filter((item) => item !== id) });
			}
		};
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

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}

		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [isOpen]);

	return { transitionRef };
};
