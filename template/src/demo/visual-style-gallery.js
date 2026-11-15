/* Visual style gallery: the theme switch, sharing the app's stored preference. */

import { attachThemeSwitch } from '../vendor/design/js/theme-switch.js';

attachThemeSwitch(document.querySelector('[data-theme-switch]'), { appName: '{{app-name}}' });
