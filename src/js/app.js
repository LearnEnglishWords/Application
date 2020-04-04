// Import Framework7
import Framework7 from 'framework7/framework7-lite.esm.bundle.js';

// Import Framework7-Svelte Plugin
import Framework7Svelte from 'framework7-svelte';

// Import Framework7 Styles
import 'framework7/css/framework7.bundle.css';

// Import Icons and App Custom Styles
import '../css/app.css';
import '../css/new.css';
import '../css/animate.css';
import '../css/test.sass';

// Import App Component
import App from '../components/App.svelte';

// Init F7 Svelte Plugin
Framework7.use(Framework7Svelte)

// Mount Svelte App
const app = new App({
  target: document.getElementById('app'),
});
