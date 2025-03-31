import { FC, FocusEventHandler, MouseEventHandler, ReactElement, ReactNode } from 'react';
import { Transition } from 'react-transition-group';

import { SYSTEM_TRANSITION_MS_100 } from '@/shared/constants';
import { useTooltip } from '@/shared/hooks';
import { classNames } from '@/shared/lib';
import { TTooltipPlacement } from '@/shared/types';

import { FloatingContainer } from '../FloatingContainer';
import { Portal } from '../Portal';

import styles from './Tooltip.module.css';

type TTooltipChildrenProps = {
	onMouseEnter: MouseEventHandler<HTMLElement>;
	onMouseLeave: MouseEventHandler<HTMLElement>;
	onFocus: FocusEventHandler<HTMLElement>;
	onBlur: FocusEventHandler<HTMLElement>;
};

interface ITooltipProps {
	children: (props: TTooltipChildrenProps) => ReactElement;
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
	const { isOpen, floatingContainerRef, handleOpen, handleClose } = useTooltip({
		placement,
		offset,
	});

	return (
		<>
			{children({
				onMouseEnter: handleOpen,
				onMouseLeave: handleClose,
				onFocus: handleOpen,
				onBlur: handleClose,
			})}
			<Transition
				nodeRef={floatingContainerRef}
				in={isOpen}
				timeout={SYSTEM_TRANSITION_MS_100}
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
		</>
	);
};
