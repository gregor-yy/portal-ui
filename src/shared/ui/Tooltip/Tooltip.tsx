import { FC, ReactNode } from 'react';
import { Transition } from 'react-transition-group';

import { ETransition } from '@/shared/constants';
import { useTooltip } from '@/shared/hooks';
import { classNames } from '@/shared/lib';
import { TTooltipPlacement } from '@/shared/types';

import { FloatingContainer } from '../FloatingContainer';
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
	const { isOpen, anchorRef, floatingContainerRef, handleOpen, handleClose } = useTooltip({
		placement,
		offset,
	});

	return (
		<div ref={anchorRef} onMouseEnter={handleOpen} onMouseLeave={handleClose} onFocus={handleOpen}>
			{children}
			<Transition
				nodeRef={floatingContainerRef}
				in={isOpen}
				timeout={ETransition.TRANSITION_100}
				mountOnEnter
				unmountOnExit
			>
				{(status) => (
					<Portal>
						<FloatingContainer
							ref={floatingContainerRef}
							isOpen={status === 'entering' || status === 'entered'}
							className={classNames(
								styles.body,
								styles[placement],
								{
									[styles.bodyWithArrow]: isArrowShow,
								},
								className,
							)}
						>
							{content}
						</FloatingContainer>
					</Portal>
				)}
			</Transition>
		</div>
	);
};
