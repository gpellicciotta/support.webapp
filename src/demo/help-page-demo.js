/* Look and theme switchers and interactive help-page pattern demo. */

import { initGallery } from './gallery.js';
import { attachHelpPage } from '../js/help-page.js';
import { attachLabelTooltips } from '../js/tooltip.js';

const DEMO_RELEASES = [
    {
        version: '1.4.2',
        isPreRelease: false,
        tag: 'released: 2026-11-23',
        isLatest: true,
        entries: [
            {
                rawText: 'FrontEnd: Added searchable `help-page` guides and topic filter chips.',
                text: 'Added searchable `help-page` guides and topic filter chips.',
                category: 'feature',
                isUserFacing: true,
                isBreaking: false
            },
            {
                rawText: 'DevEx: Updated automated layout verification across looks.',
                text: 'Updated automated layout verification across looks.',
                category: 'internal',
                isUserFacing: false,
                isBreaking: false
            }
        ]
    },
    {
        version: '1.4.1',
        isPreRelease: false,
        tag: 'released: 2026-11-18',
        isLatest: false,
        entries: [
            {
                rawText: 'Fix: Preserved scroll position while switching theme preferences.',
                text: 'Preserved scroll position while switching theme preferences.',
                category: 'fix',
                isUserFacing: true,
                isBreaking: false
            }
        ]
    }
];

if (typeof document !== 'undefined') {
    initGallery(document, window);
    attachLabelTooltips(document);
    const root = document.querySelector('[data-help-page]');
    if (root) {
        attachHelpPage(root, {
            syncUrl: true,
            feedback: {
                address: 'support@example.test',
                appName: 'Demo Workspace',
                version: '1.4.2',
                user: { name: 'Alex North', email: 'alex@example.test' }
            },
            releases: DEMO_RELEASES,
            releaseNotes: {
                idPrefix: 'help-demo-releases'
            }
        });
    }
}
