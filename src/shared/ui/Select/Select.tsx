import { ChangeEvent, Key, ReactNode, useCallback, useId, useMemo, useRef, useState } from 'react';
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

type TSelectSearchValue = string | null;

type TDefaultSelectOption = string;

type TSelectClasses = { input?: string; dropdown?: string; list?: string; option?: string; notFound?: string };

function isDefaultSelectOption(option: unknown): option is TDefaultSelectOption {
	return typeof option === 'string';
}

const isDevelopmentMode = process.env.NODE_ENV === 'development';

const getNotStandardOptionError = (propName: string): string =>
	`If you are not using a 'string' type of options, you must pass the '${propName}' parameter.`;

const handleNotStandardOption = (propName: string): string => {
	const error = getNotStandardOptionError(propName);

	if (isDevelopmentMode) {
		throw new Error(error);
	}

	console.error(error);
	return '';
};

const defaultGetOptionValue = <TSelectOption,>(option: TSelectOption): string => {
	if (isDefaultSelectOption(option)) return option;
	return handleNotStandardOption('getOptionLabel');
};

const defaultGetOptionLabel = <TSelectOption,>(option: TSelectOption): string => {
	if (isDefaultSelectOption(option)) return option;
	return handleNotStandardOption('getOptionValue');
};

const defaultRenderValue = <TSelectOption,>(value: TSelectOption): string => {
	if (Array.isArray(value)) {
		return value.map((item) => (isDefaultSelectOption(item) ? item : '')).join(', ');
	}
	if (isDefaultSelectOption(value)) return value;
	return handleNotStandardOption('renderValue');
};

interface ISelectBaseProps<TSelectOption = TDefaultSelectOption> {
	isOpen?: boolean;
	onOpenChange?: (isOpen: boolean) => void;

	classes?: TSelectClasses;

	options: TSelectOption[];
	getOptionKey?: (option: TSelectOption) => Key;
	getOptionValue?: (option: TSelectOption) => string;
	getOptionLabel?: (option: TSelectOption) => string;
	renderOption?: (option: TSelectOption, isSelected: boolean) => ReactNode;

	loading?: boolean | ReactNode;
	searchValue?: TSelectSearchValue;
	onSearch?: (value: TSelectSearchValue) => void;

	dropdownError?: ReactNode;

	placeholder?: string;
	notFoundMessage?: string;
}

interface ISingleSelectProps<TSelectOption> extends ISelectBaseProps<TSelectOption> {
	multiple?: false;
	value?: TSelectOption;
	onChange?: (option: TSelectOption) => void;
	renderValue?: (option: TSelectOption) => string;
}

interface IMultipleSelectProps<TSelectOption> extends ISelectBaseProps<TSelectOption> {
	multiple: true;
	value?: TSelectOption[];
	onChange?: (option: TSelectOption[]) => void;
	renderValue?: (option: TSelectOption[]) => string;
}

type TSelectProps<TSelectOption> = ISingleSelectProps<TSelectOption> | IMultipleSelectProps<TSelectOption>;

export const Select = <TSelectOption,>({
	isOpen: isOpenProp,
	onOpenChange: setIsOpenProp,
	classes,
	options,
	getOptionKey,
	getOptionValue = defaultGetOptionValue,
	getOptionLabel = defaultGetOptionLabel,
	renderOption = (option) => <>{getOptionLabel(option)}</>,
	multiple = false,
	value,
	renderValue = defaultRenderValue,
	onChange,
	loading,
	searchValue = null,
	onSearch,
	dropdownError,
	placeholder,
	notFoundMessage,
}: TSelectProps<TSelectOption>) => {
	const id = useId();
	const transitionRef = useRef<HTMLDivElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const listboxRef = useRef<HTMLUListElement | null>(null);

	const [isOpenState, setIsOpenState] = useState(false);

	const isOpen = useMemo(() => (isOpenProp !== undefined ? isOpenProp : isOpenState), [isOpenState, isOpenProp]);
	const setIsOpen = useCallback(
		(isOpen: boolean) => {
			if (setIsOpenProp) setIsOpenProp(isOpen);
			else setIsOpenState(isOpen);
		},
		[setIsOpenState, setIsOpenProp, isOpenProp],
	);

	const inputValue = useMemo(() => {
		if (searchValue !== null) return searchValue;
		if (value === undefined) return '';
		return multiple
			? (renderValue as (value: TSelectOption[]) => string)(value as TSelectOption[])
			: (renderValue as (value: TSelectOption) => string)(value as TSelectOption);
	}, [value, searchValue, multiple]);

	const isSearchable = !!onSearch;
	const isShowDropdownError = !!dropdownError;
	const isShowLoader = !isShowDropdownError && !!loading;
	const isEmptyOptions = !isShowDropdownError && options.length === 0;
	const isShowNotFoundMessage = !isShowDropdownError && !isShowLoader && notFoundMessage && isEmptyOptions;
	const isShowOptions = !isShowDropdownError && !isShowLoader && !isShowNotFoundMessage;
	const isHideEmptyDropdown = isShowOptions && isEmptyOptions;

	const handleOpen = () => {
		setIsOpen(true);
		if (isSearchable) onSearch('');
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

	const handleChange = (newValue: TSelectOption) => {
		if (onChange) {
			if (multiple) {
				const newValues = [...(value as TSelectOption[])];
				const newValueIndex = newValues.findIndex((item) => getOptionValue(item) === getOptionValue(newValue));
				if (newValueIndex === -1) {
					newValues.push(newValue);
				} else {
					newValues.splice(newValueIndex, 1);
				}
				(onChange as (value: TSelectOption[]) => void)(newValues);
			} else {
				(onChange as (value: TSelectOption) => void)(newValue);
			}
		}
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
											const optionValue = getOptionValue(option);
											const key = getOptionKey ? getOptionKey(option) : optionValue;
											const isSelected = multiple
												? Array.isArray(value) &&
													value.some((v) => getOptionValue(v) === optionValue)
												: !Array.isArray(value) &&
													value !== undefined &&
													optionValue === getOptionValue(value);
											return (
												<li
													key={key}
													data-value={optionValue}
													className={classNames(
														styles.option,
														{ [styles.selected]: isSelected },
														classes?.option,
													)}
													aria-selected={isSelected}
													onClick={() => handleChange(option)}
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
