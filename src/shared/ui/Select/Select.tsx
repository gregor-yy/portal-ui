import { ChangeEvent, FC, ReactNode, useCallback, useId, useMemo, useRef, useState } from 'react';
import { Transition } from 'react-transition-group';

import { SYSTEM_TRANSITION_MS_100 } from '@/shared/constants';
import { useDialog, usePopover } from '@/shared/hooks';
import { classNames, isBoolean, isString } from '@/shared/lib';

import { Backdrop } from '../Backdrop';
import { FloatingContainer } from '../FloatingContainer';
import { Input } from '../Input';
import { Loader } from '../Loader';
import { Portal } from '../Portal';

import styles from './Select.module.css';

type TSelectValue = string;

type TSelectSearchValue = string | null;

type TSelectOption = {
	value: TSelectValue;
	label: string;
};

type TSelectClasses = { input?: string; dropdown?: string; list?: string; option?: string; notFound?: string };

const defaultRenderOption = (option: TSelectOption) => option.label;

interface ISelectProps {
	isOpen?: boolean;
	onOpenChange?: (isOpen: boolean) => void;

	classes?: TSelectClasses;

	options: TSelectOption[];
	renderOption?: (option: TSelectOption, isSelected: boolean) => ReactNode;

	value?: TSelectValue;
	onChange?: (value: TSelectValue) => void;

	loading?: boolean | ReactNode;
	searchValue?: TSelectSearchValue;
	onSearch?: (value: TSelectSearchValue) => void;
	dropdownError?: ReactNode;

	placeholder?: string;
	notFoundMessage?: string;
}

export const Select: FC<ISelectProps> = ({
	isOpen: isOpenProp,
	onOpenChange: setIsOpenProp,
	classes,
	options,
	renderOption = defaultRenderOption,
	value,
	onChange,
	loading,
	searchValue = null,
	onSearch,
	dropdownError,
	placeholder,
	notFoundMessage,
}) => {
	const id = useId();
	const transitionRef = useRef<HTMLDivElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const listboxRef = useRef<HTMLUListElement | null>(null);

	const [isOpenState, setIsOpenState] = useState(false);

	const isOpen = useMemo(() => (isOpenProp !== undefined ? isOpenProp : isOpenState), [isOpenState, isOpenProp]);
	const setIsOpen = useCallback(
		(isOpen: boolean) => {
			if (isOpenProp !== undefined) {
				if (setIsOpenProp) setIsOpenProp(isOpen);
			} else {
				setIsOpenState(isOpen);
			}
		},
		[setIsOpenState, setIsOpenProp, isOpenProp],
	);

	const inputValue = useMemo(() => (searchValue !== null ? searchValue : value), [value, searchValue]);

	const isSearchable = !!onSearch;
	const isShowDropdownError = !!dropdownError;
	const isShowLoader = !isShowDropdownError && !!loading;
	const isEmptyOptions = !isShowDropdownError && options.length === 0;
	const isShowNotFoundMessage = !isShowDropdownError && !isShowLoader && notFoundMessage && isEmptyOptions;
	const isShowOptions = !isShowDropdownError && !isShowLoader && !isShowNotFoundMessage;
	const isHideEmptyDropdown = isShowOptions && isEmptyOptions;

	const handleOpen = () => {
		setIsOpen(true);
	};
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
	const handleChange = (value: TSelectValue) => {
		if (onChange && value) onChange(value);
		handleClose();
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
		<>
			<div className={styles.anchor} ref={containerRef}>
				<Input
					placeholder={placeholder}
					value={inputValue}
					className={classNames(styles.field, classes?.input)}
					readOnly={!isSearchable}
					onClick={handleOpen}
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
								className={classNames(
									styles.body,
									{ [styles.hidden]: isHideEmptyDropdown },
									classes?.dropdown,
								)}
							>
								{isShowDropdownError &&
									(isString(dropdownError) ? (
										<p className={classNames(styles.dropdownError)}>{dropdownError}</p>
									) : (
										dropdownError
									))}
								{isShowLoader &&
									(isBoolean(loading) ? (
										<div className={styles.loaderContainer}>
											<Loader className={styles.loader} />
										</div>
									) : (
										loading
									))}
								{isShowNotFoundMessage && (
									<p className={classNames(styles.notFound, classes?.notFound)}>{notFoundMessage}</p>
								)}
								{isShowOptions && (
									<ul
										className={classNames(styles.list, classes?.list)}
										role="listbox"
										ref={listboxRef}
									>
										{options.map((option) => {
											const isSelected = option.value === value;
											return (
												<li
													key={`${option.value} ${option.label}`}
													data-value={option.value}
													className={classNames(
														styles.option,
														{ [styles.selected]: isSelected },
														classes?.option,
													)}
													aria-selected={isSelected}
													onClick={() => handleChange(option.value)}
													role="option"
												>
													{renderOption(option, isSelected)}
												</li>
											);
										})}
									</ul>
								)}
							</FloatingContainer>
						</div>
					</Portal>
				)}
			</Transition>
		</>
	);
};
