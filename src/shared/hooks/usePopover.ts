import { useLayoutEffect, useRef } from 'react';

import { TPopoverPlacement } from '../types';

interface IUsePopoverProps {
	isOpen: boolean;
	anchorEl?: HTMLElement | null;
	anchorPlacement: TPopoverPlacement;
	placement: TPopoverPlacement;
	isAnchorWidth?: boolean;
}

export const usePopover = ({
	isOpen,
	anchorEl,
	anchorPlacement,
	placement,
	isAnchorWidth = false,
}: IUsePopoverProps) => {
	const floatingContainerRef = useRef<HTMLDivElement | null>(null);

	useLayoutEffect(() => {
		if (!isOpen) return;

		const anchor = anchorEl;
		const floatingContainer = floatingContainerRef.current;

		if (!(anchor && floatingContainer)) return;

		if (isAnchorWidth) {
			floatingContainer.style.width = `${anchor.offsetWidth}px`;
		}

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

		const floatingContainerWidth = floatingContainer.offsetWidth;
		const floatingContainerHeight = floatingContainer.offsetHeight;

		let floatingContainerTop = 0;
		let floatingContainerLeft = 0;

		const [verticalPlacement, horizontalPlacement] = placement.split('-');

		switch (verticalPlacement) {
			case 'top':
				floatingContainerTop = anchorVerticalPosition - floatingContainerHeight;
				break;
			case 'center':
				floatingContainerTop = anchorVerticalPosition - floatingContainerHeight / 2;
				break;
			case 'bottom':
				floatingContainerTop = anchorVerticalPosition;
				break;
			default:
				break;
		}

		switch (horizontalPlacement) {
			case 'left':
				floatingContainerLeft = anchorHorizontalPosition - floatingContainerWidth;
				break;
			case 'center':
				floatingContainerLeft = anchorHorizontalPosition - floatingContainerWidth / 2;
				break;
			case 'right':
				floatingContainerLeft = anchorHorizontalPosition;
				break;
			default:
				break;
		}

		floatingContainer.style.top = `${floatingContainerTop}px`;
		floatingContainer.style.left = `${floatingContainerLeft}px`;
	}, [isOpen, anchorPlacement, placement, anchorEl]);

	return { floatingContainerRef };
};
