import { FC, ReactNode, useEffect, useRef } from 'react';

interface IFocusTrapProps {
	children: ReactNode;
}

export const FocusTrap: FC<IFocusTrapProps> = ({ children }) => {
	const trapRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleTabKey = (e: KeyboardEvent) => {
			if (!trapRef.current) return;

			const focusableElements = trapRef.current.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
			);

			if (focusableElements.length === 0) return;

			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			if (e.key === 'Tab') {
				if (e.shiftKey && document.activeElement === firstElement) {
					e.preventDefault();
					lastElement.focus();
				} else if (!e.shiftKey && document.activeElement === lastElement) {
					e.preventDefault();
					firstElement.focus();
				}
			}
		};

		const trapElement = trapRef.current;
		trapElement?.addEventListener('keydown', handleTabKey);

		const firstFocusableElement = trapElement?.querySelector<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
		);
		if (firstFocusableElement) {
			firstFocusableElement.focus();
		}

		return () => {
			trapElement?.removeEventListener('keydown', handleTabKey);
		};
	}, []);

	return <div ref={trapRef}>{children}</div>;
};
