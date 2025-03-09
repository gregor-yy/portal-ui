import { useLayoutEffect, useRef } from 'react';

import { TPopoverPlacement } from '../types';

interface IUsePopoverProps {
	isOpen: boolean;
	anchorEl: HTMLElement | null;
	anchorPlacement: TPopoverPlacement;
	placement: TPopoverPlacement;
}

export const usePopover = ({ isOpen, anchorEl, anchorPlacement, placement }: IUsePopoverProps) => {
	const overlayRef = useRef<HTMLDivElement | null>(null);

	useLayoutEffect(() => {
		if (!isOpen) return;

		const anchor = anchorEl;
		const overlay = overlayRef.current;

		if (!(anchor && overlay)) return;

		let anchorHorizontalPosition = 0;
		let anchorVerticalPosition = 0;

		const anchorTop = anchor.offsetTop;
		const anchorLeft = anchor.offsetLeft;
		const anchorWidth = anchor.offsetWidth;
		const anchorHeight = anchor.offsetHeight;

		const [anchorVerticalPlacement, anchorHorizontalPlacement] = anchorPlacement.split('-');

		switch (anchorHorizontalPlacement) {
			case 'left':
				anchorHorizontalPosition = anchorLeft;
				break;
			case 'center':
				anchorHorizontalPosition = anchorLeft + anchorWidth / 2;
				break;
			case 'right':
				anchorHorizontalPosition = anchorLeft + anchorWidth;
				break;
			default:
				break;
		}

		switch (anchorVerticalPlacement) {
			case 'top':
				anchorVerticalPosition = anchorTop;
				break;
			case 'center':
				anchorVerticalPosition = anchorTop + anchorHeight / 2;
				break;
			case 'bottom':
				anchorVerticalPosition = anchorTop + anchorHeight;
				break;
			default:
				break;
		}

		const overlayWidth = overlay.offsetWidth;
		const overlayHeight = overlay.offsetHeight;

		let overlayTop = 0;
		let overlayLeft = 0;

		const [verticalPlacement, horizontalPlacement] = placement.split('-');

		switch (verticalPlacement) {
			case 'top':
				overlayTop = anchorVerticalPosition - overlayHeight;
				break;
			case 'center':
				overlayTop = anchorVerticalPosition - overlayHeight / 2;
				break;
			case 'bottom':
				overlayTop = anchorVerticalPosition;
				break;
			default:
				break;
		}

		switch (horizontalPlacement) {
			case 'left':
				overlayLeft = anchorHorizontalPosition - overlayWidth;
				break;
			case 'center':
				overlayLeft = anchorHorizontalPosition - overlayWidth / 2;
				break;
			case 'right':
				overlayLeft = anchorHorizontalPosition;
				break;
			default:
				break;
		}

		overlay.style.top = `${overlayTop}px`;
		overlay.style.left = `${overlayLeft}px`;
	}, [isOpen, anchorPlacement, placement, anchorEl]);

	return { overlayRef };
};
