import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@mantine/core/styles.css';
import App from './App.jsx'
import { MantineProvider } from '@mantine/core';
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';


createRoot(document.getElementById('root')).render(
  <MantineProvider>
    <Notifications />
    <App />
  </MantineProvider>
)
