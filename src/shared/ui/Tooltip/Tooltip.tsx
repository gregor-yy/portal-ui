import { FC, ReactNode } from 'react';
import { Transition } from 'react-transition-group';

import { ETransition } from '@/shared/constants';
import { useTooltip } from '@/shared/hooks';
import { classNames } from '@/shared/lib';
import { TTooltipPlacement } from '@/shared/types';

import { Portal } from '../Portal';

import styles from './Tooltip.module.css';

interface ITooltipProps {
	children: ReactNode;
	content: string | ReactNode;
	placement?: TTooltipPlacement;
	isArrowShow?: boolean;
	className?: string;
	offset?: number;
}

export const Tooltip: FC<ITooltipProps> = ({
	children,
	content,
	placement = 'top',
	isArrowShow = false,
	className,
	offset,
}) => {
	const { isOpen, anchorRef, overlayRef, handleOpen, handleClose } = useTooltip({
		placement,
		offset,
	});

	return (
		<div ref={anchorRef} onMouseEnter={handleOpen} onMouseLeave={handleClose} onFocus={handleOpen}>
			{children}
			<Transition
				nodeRef={overlayRef}
				in={isOpen}
				timeout={ETransition.TRANSITION_100}
				mountOnEnter
				unmountOnExit
			>
				{(status) => (
					<Portal>
						<div
							ref={overlayRef}
							className={classNames(
								styles.body,
								styles[placement],
								{
									[styles.enter]: status === 'entering' || status === 'entered',
									[styles.bodyWithArrow]: isArrowShow,
								},
								className,
							)}
						>
							{content}
						</div>
					</Portal>
				)}
			</Transition>
		</div>
	);
};
