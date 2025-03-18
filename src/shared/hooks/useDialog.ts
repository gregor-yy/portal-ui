import { useEffect, useId, useLayoutEffect } from 'react';

import { getScrollbarWidth } from '../lib/getScrollbarWidth';
import { useSelector, useUpdate } from '../store';

interface IUseDialogStackProps {
	isOpen: boolean;
	onClose?: () => void;
}

export const useDialog = ({ isOpen, onClose }: IUseDialogStackProps) => {
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
		const previousInlinePaddingRight = document.body.style.paddingRight;
		const previousPaddingRight = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'));
		const scrollbarWidth = getScrollbarWidth();

		document.body.style.overflow = 'hidden';
		document.body.style.paddingRight = `${previousPaddingRight + scrollbarWidth}px`;

		const root = document.getElementById('root');
		if (root) root.inert = true;

		return () => {
			document.body.style.overflow = previousOverflow;
			document.body.style.paddingRight = previousInlinePaddingRight;

			if (root) root.removeAttribute('inert');
		};
	}, [isOpen]);
};
