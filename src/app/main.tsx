import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { AppProvider } from '@/shared/store';

import { App } from './App.tsx';

import './styles/global.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AppProvider initialState={{ dialogStack: [] }}>
			<App />
		</AppProvider>
	</StrictMode>,
);
