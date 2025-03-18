import { useLayoutEffect, useRef, useState } from 'react';

import { DEFAULT_TOOLTIP_OFFSET_PX } from '../constants';
import { TTooltipPlacement } from '../types';

interface IUseTooltipProps {
	placement: TTooltipPlacement;
	offset?: number;
}

export const useTooltip = ({ placement, offset = DEFAULT_TOOLTIP_OFFSET_PX }: IUseTooltipProps) => {
	const anchorRef = useRef<HTMLDivElement | null>(null);
	const floatingContainerRef = useRef<HTMLDivElement | null>(null);

	const [isOpen, setIsOpen] = useState(false);

	const handleOpen = () => setIsOpen(true);
	const handleClose = () => setIsOpen(false);

	useLayoutEffect(() => {
		if (!isOpen) return;

		const anchor = anchorRef.current;
		const floatingContainer = floatingContainerRef.current;

		if (!(anchor && floatingContainer)) return;

		const containerTop = anchor.offsetTop;
		const containerLeft = anchor.offsetLeft;
		const containerWidth = anchor.offsetWidth;
		const containerHeight = anchor.offsetHeight;

		const floatingContainerWidth = floatingContainer.offsetWidth;
		const floatingContainerHeight = floatingContainer.offsetHeight;

		let floatingContainerTop = 0;
		let floatingContainerLeft = 0;

		switch (placement) {
			case 'top-start':
				floatingContainerTop = containerTop - floatingContainerHeight - offset;
				floatingContainerLeft = containerLeft;
				break;
			case 'top':
				floatingContainerTop = containerTop - floatingContainerHeight - offset;
				floatingContainerLeft = containerLeft + containerWidth / 2 - floatingContainerWidth / 2;
				break;
			case 'top-end':
				floatingContainerTop = containerTop - floatingContainerHeight - offset;
				floatingContainerLeft = containerLeft + containerWidth - floatingContainerWidth;
				break;
			case 'right-start':
				floatingContainerTop = containerTop;
				floatingContainerLeft = containerLeft + containerWidth + offset;
				break;
			case 'right':
				floatingContainerTop = containerTop + containerHeight / 2 - floatingContainerHeight / 2;
				floatingContainerLeft = containerLeft + containerWidth + offset;
				break;
			case 'right-end':
				floatingContainerTop = containerTop + containerHeight - floatingContainerHeight;
				floatingContainerLeft = containerLeft + containerWidth + offset;
				break;
			case 'bottom-start':
				floatingContainerTop = containerTop + containerHeight + offset;
				floatingContainerLeft = containerLeft;
				break;
			case 'bottom':
				floatingContainerTop = containerTop + containerHeight + offset;
				floatingContainerLeft = containerLeft + containerWidth / 2 - floatingContainerWidth / 2;
				break;
			case 'bottom-end':
				floatingContainerTop = containerTop + containerHeight + offset;
				floatingContainerLeft = containerLeft + containerWidth - floatingContainerWidth;
				break;
			case 'left-start':
				floatingContainerTop = containerTop;
				floatingContainerLeft = containerLeft - floatingContainerWidth - offset;
				break;
			case 'left':
				floatingContainerTop = containerTop + containerHeight / 2 - floatingContainerHeight / 2;
				floatingContainerLeft = containerLeft - floatingContainerWidth - offset;
				break;
			case 'left-end':
				floatingContainerTop = containerTop + containerHeight - floatingContainerHeight;
				floatingContainerLeft = containerLeft - floatingContainerWidth - offset;
				break;
			default:
				break;
		}

		floatingContainer.style.top = `${floatingContainerTop}px`;
		floatingContainer.style.left = `${floatingContainerLeft}px`;
	}, [isOpen, placement, offset]);

	return { anchorRef, floatingContainerRef, isOpen, handleOpen, handleClose };
};
