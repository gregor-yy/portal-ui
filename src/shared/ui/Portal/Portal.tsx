import { FC, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface IPortalProps {
	children: ReactNode;
	container?: Element | DocumentFragment;
}

export const Portal: FC<IPortalProps> = ({ children, container = document.body }) => {
	return createPortal(children, container);
};
