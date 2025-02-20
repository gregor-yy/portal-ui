import { createContext, ReactNode, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

class Store<T> {
	private subscriptions: (() => void)[] = [];
	private state: T;

	constructor(initialState: T) {
		this.state = initialState;
	}

	getState = () => {
		return this.state;
	};

	update = (partialNewState: Partial<T>) => {
		this.state = { ...this.state, ...partialNewState };

		this.subscriptions.forEach((callback) => {
			callback();
		});
	};

	subscribe = (callback: () => void) => {
		this.subscriptions.push(callback);

		return () => {
			const index = this.subscriptions.indexOf(callback);

			if (index === -1) {
				return;
			}

			this.subscriptions.splice(index, 1);
		};
	};
}

export function createOptimizedContext<T>() {
	const Context = createContext<Store<T> | null>(null);

	const Provider = ({ initialState, children }: { initialState: T; children: ReactNode }) => {
		const store = useMemo(() => new Store(initialState), []);

		return <Context.Provider value={store}>{children}</Context.Provider>;
	};

	const useStore = () => {
		const store = useContext(Context);
		if (!store) {
			throw new Error('Can not use `useStore`, outside of the `Provider`');
		}
		return store;
	};

	const useSelector = <Result,>(selector: (state: T) => Result) => {
		const store = useStore();

		const [value, setValue] = useState(() => selector(store.getState()));

		const selectorRef = useRef(selector);
		const valueRef = useRef(value);

		useLayoutEffect(() => {
			selectorRef.current = selector;
			valueRef.current = value;
		});

		useEffect(() => {
			return store.subscribe(() => {
				const state = selectorRef.current(store.getState());

				if (valueRef.current === state) {
					return;
				}

				setValue(state);
			});
		}, [store]);

		return value;
	};

	const useUpdate = () => {
		const store = useStore();

		return store.update;
	};

	return { Provider, useSelector, useUpdate };
}
