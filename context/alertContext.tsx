import {
	createContext,
	Dispatch,
	SetStateAction,
	useEffect,
	useState,
} from 'react';

type VariantTypes = 'success' | 'error';

interface UseAlertInterface {
	title?: string;
	show?: boolean;
	variant?: VariantTypes;
}

interface contextInterface {
	alert: UseAlertInterface;
	setAlert?: Dispatch<SetStateAction<UseAlertInterface>>;
	close?: () => void;
}

export const defaultAlert: UseAlertInterface = {
	title: '',
	show: false,
	variant: null,
};

export const AlertContext = createContext<contextInterface>({
	alert: defaultAlert,
});

export const AlertContextProvider = ({ children }) => {
	const [state, setState] = useState<UseAlertInterface>(defaultAlert);

	useEffect(() => {
		if (state.show) {
			setTimeout(() => closeAlert(), 3500);
		}
	}, [state]);

	const handleModifyState = ({ title, show, variant }: UseAlertInterface) => {
		setState({ ...state, title, show, variant });
	};

	const closeAlert = () => {
		setState({ ...state, ...defaultAlert });
	};

	return (
		<AlertContext.Provider
			value={{ alert: state, setAlert: handleModifyState, close: closeAlert }}
		>
			{children}
		</AlertContext.Provider>
	);
};
