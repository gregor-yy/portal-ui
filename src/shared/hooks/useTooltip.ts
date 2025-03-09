import { useLayoutEffect, useRef, useState } from 'react';

import { DEFAULT_TOOLTIP_OFFSET_PX } from '../constants';
import { TTooltipPlacement } from '../types';

interface IUseTooltipProps {
	placement: TTooltipPlacement;
	offset?: number;
}

export const useTooltip = ({ placement, offset = DEFAULT_TOOLTIP_OFFSET_PX }: IUseTooltipProps) => {
	const anchorRef = useRef<HTMLDivElement | null>(null);
	const overlayRef = useRef<HTMLDivElement | null>(null);

	const [isOpen, setIsOpen] = useState(false);

	const handleOpen = () => setIsOpen(true);
	const handleClose = () => setIsOpen(false);

	useLayoutEffect(() => {
		if (!isOpen) return;

		const anchor = anchorRef.current;
		const overlay = overlayRef.current;

		if (!(anchor && overlay)) return;

		const containerTop = anchor.offsetTop;
		const containerLeft = anchor.offsetLeft;
		const containerWidth = anchor.offsetWidth;
		const containerHeight = anchor.offsetHeight;

		const overlayWidth = overlay.offsetWidth;
		const overlayHeight = overlay.offsetHeight;

		let overlayTop = 0;
		let overlayLeft = 0;

		switch (placement) {
			case 'top-start':
				overlayTop = containerTop - overlayHeight - offset;
				overlayLeft = containerLeft;
				break;
			case 'top':
				overlayTop = containerTop - overlayHeight - offset;
				overlayLeft = containerLeft + containerWidth / 2 - overlayWidth / 2;
				break;
			case 'top-end':
				overlayTop = containerTop - overlayHeight - offset;
				overlayLeft = containerLeft + containerWidth - overlayWidth;
				break;
			case 'right-start':
				overlayTop = containerTop;
				overlayLeft = containerLeft + containerWidth + offset;
				break;
			case 'right':
				overlayTop = containerTop + containerHeight / 2 - overlayHeight / 2;
				overlayLeft = containerLeft + containerWidth + offset;
				break;
			case 'right-end':
				overlayTop = containerTop + containerHeight - overlayHeight;
				overlayLeft = containerLeft + containerWidth + offset;
				break;
			case 'bottom-start':
				overlayTop = containerTop + containerHeight + offset;
				overlayLeft = containerLeft;
				break;
			case 'bottom':
				overlayTop = containerTop + containerHeight + offset;
				overlayLeft = containerLeft + containerWidth / 2 - overlayWidth / 2;
				break;
			case 'bottom-end':
				overlayTop = containerTop + containerHeight + offset;
				overlayLeft = containerLeft + containerWidth - overlayWidth;
				break;
			case 'left-start':
				overlayTop = containerTop;
				overlayLeft = containerLeft - overlayWidth - offset;
				break;
			case 'left':
				overlayTop = containerTop + containerHeight / 2 - overlayHeight / 2;
				overlayLeft = containerLeft - overlayWidth - offset;
				break;
			case 'left-end':
				overlayTop = containerTop + containerHeight - overlayHeight;
				overlayLeft = containerLeft - overlayWidth - offset;
				break;
			default:
				break;
		}

		overlay.style.top = `${overlayTop}px`;
		overlay.style.left = `${overlayLeft}px`;
	}, [isOpen, placement, offset]);

	return { anchorRef, overlayRef, isOpen, handleOpen, handleClose };
};
