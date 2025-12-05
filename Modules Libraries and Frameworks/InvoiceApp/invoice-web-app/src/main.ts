import './style.css';
import { initLayout } from './layout';
import { initRouter } from './router';
import { initAppData } from './data';

// Initialize the app
initAppData();  // Load sample data at startup
initLayout();
initRouter();

