import {
	ChangeEvent,
	createContext,
	FC,
	ReactElement,
	ReactNode,
	useContext,
	useId,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Transition } from 'react-transition-group';

import { SYSTEM_TRANSITION_MS_100 } from '@/shared/constants';
import { useDialog, usePopover } from '@/shared/hooks';
import { classNames } from '@/shared/lib';

import { Backdrop } from '../Backdrop';
import { FloatingContainer } from '../FloatingContainer';
import { Input } from '../Input';
import { Portal } from '../Portal';

import styles from './Select.module.css';

type TSelectValue = string;

type TDropdownContextData = {
	value: TSelectValue | undefined;
	onChange?: (value: TSelectValue) => void;
	handleClose: () => void;
};

const Context = createContext<TDropdownContextData | undefined>(undefined);

interface IOptionProps {
	value?: TSelectValue;
	children: ReactNode;
	className?: string;
	disabled?: boolean;
}

const Option: FC<IOptionProps> = ({ value, children, className, disabled }) => {
	const store = useContext(Context);

	if (!store) return null;

	const { value: selectValue, onChange } = store;

	const isSelected = selectValue === value;

	const handleMouseDown = () => {
		if (disabled) return;
		if (onChange && value) onChange(value);
	};

	return (
		<li
			data-value={value}
			className={classNames(styles.option, isSelected && styles.selected, disabled && styles.disabled, className)}
			aria-selected={isSelected}
			onMouseDown={handleMouseDown}
			role="option"
		>
			{children}
		</li>
	);
};

type TOption = typeof Option;

type TSelectChild = ReactElement<TOption>;

interface ISelectProps {
	classes?: { input?: string; dropdown?: string };
	children?: TSelectChild | TSelectChild[];
	value?: TSelectValue;
	placeholder?: string;
	onChange?: (value: TSelectValue) => void;
	searchValue?: string | null;
	onSearch?: (value: string | null) => void;
}

export const Select: FC<ISelectProps> & { Option: TOption } = ({
	classes,
	children,
	value,
	placeholder,
	onChange,
	searchValue,
	onSearch,
}) => {
	const id = useId();
	const transitionRef = useRef<HTMLDivElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const listboxRef = useRef<HTMLUListElement | null>(null);

	const [isOpen, setIsOpen] = useState(false);

	const inputValue = useMemo(() => (searchValue !== null ? searchValue : value), [value, searchValue]);

	const isSearchable = !!onSearch;

	const handleOpen = () => setIsOpen(true);
	const handleClose = () => {
		setIsOpen(false);
		if (isSearchable) onSearch(null);
	};
	const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
		if (isSearchable) {
			const { value } = event.target;
			onSearch(value);
		}
	};

	const { floatingContainerRef } = usePopover({
		isOpen,
		anchorEl: containerRef.current,
		anchorPlacement: 'bottom-center',
		placement: 'bottom-center',
		isAnchorWidth: true,
	});

	useDialog({ isOpen, onClose: handleClose, inert: false });

	return (
		<Context.Provider value={{ value, onChange, handleClose }}>
			<div className={styles.anchor} ref={containerRef}>
				<Input
					placeholder={placeholder}
					value={inputValue}
					className={classNames(styles.field, classes?.input)}
					readOnly={!isSearchable}
					onFocus={handleOpen}
					onBlur={handleClose}
					onChange={handleSearch}
				/>
				<div className={styles.chevron}>
					<svg viewBox="0 0 24 24" fill="none" stroke="black">
						<path d="m6 9 6 6 6-6"></path>
					</svg>
				</div>
			</div>
			<Transition
				nodeRef={transitionRef}
				in={isOpen}
				timeout={SYSTEM_TRANSITION_MS_100}
				mountOnEnter
				unmountOnExit
			>
				{(status) => (
					<Portal>
						<div
							className={classNames(styles.container, {
								[styles.enter]: status === 'entering' || status === 'entered',
							})}
							ref={transitionRef}
						>
							<Backdrop className={styles.backdrop} onClick={handleClose} />
							<FloatingContainer
								id={id}
								ref={floatingContainerRef}
								isOpen={status === 'entering' || status === 'entered'}
								className={classNames(styles.body, classes?.dropdown)}
							>
								<ul className={styles.list} role="listbox" ref={listboxRef}>
									{children}
								</ul>
							</FloatingContainer>
						</div>
					</Portal>
				)}
			</Transition>
		</Context.Provider>
	);
};

Select.Option = Option;
