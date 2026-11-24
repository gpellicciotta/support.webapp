// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setSpriteUrl } from '../../src/js/icon.js';
import {
    attachHelpPage,
    buildFeedbackMailto,
    createHelpPage,
    formatHelpQuery,
    parseHelpQuery
} from '../../src/js/help-page.js';

const SAMPLE_RELEASES = [
    {
        version: '1.2.0',
        isPreRelease: false,
        tag: 'released: 2026-11-23',
        isLatest: true,
        entries: [
            {
                rawText: 'FrontEnd: Added `offline-cache` sync indicator.',
                text: 'Added `offline-cache` sync indicator.',
                category: 'feature',
                isUserFacing: true,
                isBreaking: false
            }
        ]
    }
];

function buildMarkup() {
    document.body.innerHTML = `
        <div class="help-page" data-help-page>
            <div class="help-page__toolbar">
                <div class="field help-page__search">
                    <label class="field__label" for="help-search">Search help</label>
                    <div class="help-page__search-row">
                        <input class="field__control help-page__search-control" id="help-search" type="search" data-help-page-search>
                        <button class="icon-button help-page__search-clear" type="button" aria-label="Clear search" data-help-page-search-clear hidden>Clear</button>
                    </div>
                </div>
                <div class="help-page__filters" role="group" aria-label="Help topics" data-help-page-filters>
                    <button class="chip chip--filter" type="button" aria-pressed="true" data-help-page-topic="all">All Topics</button>
                    <button class="chip chip--filter" type="button" aria-pressed="false" data-help-page-topic="getting-started">Getting Started</button>
                    <button class="chip chip--filter" type="button" aria-pressed="false" data-help-page-topic="security">Security</button>
                    <button class="chip chip--filter" type="button" aria-pressed="false" data-help-page-topic="faq">FAQ</button>
                    <button class="chip chip--filter" type="button" aria-pressed="false" data-help-page-topic="release-notes">Release Notes</button>
                </div>
            </div>

            <div class="empty-state help-page__no-results" data-help-page-no-results hidden>
                <h2 class="empty-state__title">No matching topics</h2>
                <p class="empty-state__text">No help topics match "<span data-help-page-no-results-term></span>".</p>
                <div class="empty-state__actions">
                    <button class="button button--secondary" type="button" data-help-page-reset>Reset Search</button>
                </div>
            </div>

            <section class="card help-page__section" data-help-page-section data-help-page-topics="getting-started">
                <h2 class="card__title">Welcome</h2>
                <p class="card__text">Support address: <a data-help-page-feedback-address href="mailto:initial@example.test">initial@example.test</a></p>
                <a class="button button--secondary" data-help-page-feedback-link href="mailto:initial@example.test">Send Feedback</a>
            </section>

            <section class="card help-page__section" data-help-page-section data-help-page-topics="getting-started security">
                <h2 class="card__title">Sessions and Access</h2>
                <p class="card__text">Revoke active device tokens remotely.</p>
            </section>

            <section class="card help-page__section" data-help-page-section data-help-page-topics="faq security">
                <h2 class="card__title">Questions &amp; Answers</h2>
                <div class="help-page__actions">
                    <button class="button button--quiet help-page__faq-toggle" type="button" data-help-page-faq-toggle aria-expanded="false">Expand All</button>
                </div>
                <div class="help-page__faq-list" data-help-page-faq-list>
                    <div class="collapsible help-page__faq" data-help-page-faq-item data-help-page-tags="sso single-sign-on delegated">
                        <button class="collapsible__toggle help-page__faq-question" type="button" aria-expanded="false" aria-controls="faq-1">How does SSO work?</button>
                        <div class="collapsible__panel" id="faq-1" hidden="until-found"><p class="card__text">Sign in once across connected apps.</p></div>
                    </div>
                    <div class="collapsible help-page__faq" data-help-page-faq-item data-help-page-tags="takeout archive export">
                        <button class="collapsible__toggle help-page__faq-question" type="button" aria-expanded="false" aria-controls="faq-2">How do I back up my data?</button>
                        <div class="collapsible__panel" id="faq-2" hidden="until-found"><p class="card__text">Download a JSON file from Account.</p></div>
                    </div>
                </div>
            </section>

            <section class="card help-page__section" data-help-page-section data-help-page-topics="release-notes">
                <h2 class="card__title">Release Notes</h2>
                <div class="release-notes" data-help-page-release-notes></div>
            </section>
        </div>`;
    return document.querySelector('[data-help-page]');
}

describe('buildFeedbackMailto', () => {
    it('builds a mailto URL carrying app name, normalized version, and signed-in user', () => {
        const url = buildFeedbackMailto({
            address: 'support@example.test',
            appName: 'Auth',
            version: 'v1.4.2',
            user: { name: 'Alex North', email: 'alex@example.test' }
        });
        expect(url.startsWith('mailto:support@example.test?')).toBe(true);
        const params = new URLSearchParams(url.split('?')[1]);
        expect(params.get('subject')).toBe('Auth Feedback (v1.4.2)');
        expect(params.get('body')).toContain('App: Auth');
        expect(params.get('body')).toContain('Version: 1.4.2');
        expect(params.get('body')).toContain('User: Alex North <alex@example.test>');
    });

    it('handles email-only, name-only, signed-out users, and missing version', () => {
        const emailOnly = buildFeedbackMailto({
            address: 'support@example.test',
            appName: 'Counters',
            user: { email: 'sam@example.test' }
        });
        expect(new URLSearchParams(emailOnly.split('?')[1]).get('body')).toContain('User: sam@example.test');
        expect(new URLSearchParams(emailOnly.split('?')[1]).get('subject')).toBe('Counters Feedback (vunknown)');

        const nameOnly = buildFeedbackMailto({
            address: 'support@example.test',
            appName: 'Counters',
            version: '2.0.0',
            user: { name: 'Sam' }
        });
        expect(new URLSearchParams(nameOnly.split('?')[1]).get('body')).toContain('User: Sam');

        const signedOut = buildFeedbackMailto({
            address: 'support@example.test',
            appName: 'Counters',
            version: '2.0.0',
            user: null
        });
        expect(new URLSearchParams(signedOut.split('?')[1]).get('body')).toContain('User: (not signed in)');
    });

    it('returns an empty string when no feedback address is given', () => {
        expect(buildFeedbackMailto({ appName: 'Auth', version: '1.0.0' })).toBe('');
        expect(buildFeedbackMailto({ address: '   ', appName: 'Auth' })).toBe('');
    });
});

describe('parseHelpQuery and formatHelpQuery', () => {
    it('parses route, hash route, query string, URLSearchParams, and object inputs', () => {
        expect(parseHelpQuery('/help?topic=faq&q=sso')).toEqual({ topic: 'faq', q: 'sso' });
        expect(parseHelpQuery('#/help?q=backup&topic=security')).toEqual({ topic: 'security', q: 'backup' });
        expect(parseHelpQuery('?topic=getting-started')).toEqual({ topic: 'getting-started', q: '' });
        expect(parseHelpQuery(new URLSearchParams('q=token'))).toEqual({ topic: '', q: 'token' });
        expect(parseHelpQuery({ topic: 'faq', q: 'reset' })).toEqual({ topic: 'faq', q: 'reset' });
        expect(parseHelpQuery('')).toEqual({ topic: '', q: '' });
    });

    it('formats active query and topic parameters while omitting defaults', () => {
        expect(formatHelpQuery({ topic: 'all', q: '' })).toBe('');
        expect(formatHelpQuery({ topic: 'faq', q: '' })).toBe('?topic=faq');
        expect(formatHelpQuery({ topic: 'all', q: 'sso' })).toBe('?q=sso');
        expect(formatHelpQuery({ topic: 'faq', q: 'sso' })).toBe('?topic=faq&q=sso');
    });
});

describe('attachHelpPage', () => {
    let root;
    let controller;

    beforeEach(() => {
        setSpriteUrl('../looks/neutral/icons.svg');
        window.history.replaceState(null, '', '/');
        root = buildMarkup();
    });

    afterEach(() => {
        controller?.destroy();
        controller = null;
        document.body.innerHTML = '';
    });

    it('filters section cards by topic chips and updates aria-pressed', () => {
        controller = attachHelpPage(root, { readLocation: false });
        const securityChip = root.querySelector('[data-help-page-topic="security"]');
        const allChip = root.querySelector('[data-help-page-topic="all"]');
        const sections = [...root.querySelectorAll('[data-help-page-section]')];

        securityChip.click();

        expect(controller.getTopic()).toBe('security');
        expect(securityChip.getAttribute('aria-pressed')).toBe('true');
        expect(allChip.getAttribute('aria-pressed')).toBe('false');
        expect(sections.map((section) => section.hidden)).toEqual([true, false, false, true]);
    });

    it('filters sections and FAQ items by search query, matching tags and expanding matching FAQs', () => {
        controller = attachHelpPage(root, { readLocation: false });
        const search = root.querySelector('[data-help-page-search]');
        const clear = root.querySelector('[data-help-page-search-clear]');
        const faqItems = [...root.querySelectorAll('[data-help-page-faq-item]')];
        const faqSection = root.querySelector('[data-help-page-topics="faq security"]');

        expect(clear.hidden).toBe(true);
        expect(document.getElementById('faq-2').getAttribute('hidden')).toBe('until-found');

        // Search a tag-only term that does not appear in visible FAQ text.
        search.value = 'takeout';
        search.dispatchEvent(new Event('input', { bubbles: true }));

        expect(clear.hidden).toBe(false);
        expect(faqSection.hidden).toBe(false);
        expect(faqItems[0].hidden).toBe(true);
        expect(faqItems[1].hidden).toBe(false);
        expect(faqItems[1].querySelector('button').getAttribute('aria-expanded')).toBe('true');
        expect(document.getElementById('faq-2').hidden).toBe(false);

        // Clearing search restores sections, hides clear button, focuses input, and collapses auto-expanded FAQs.
        clear.click();
        expect(search.value).toBe('');
        expect(clear.hidden).toBe(true);
        expect(document.activeElement).toBe(search);
        expect(faqItems.every((item) => !item.hidden)).toBe(true);
        expect(faqItems[1].querySelector('button').getAttribute('aria-expanded')).toBe('false');
        expect(document.getElementById('faq-2').getAttribute('hidden')).toBe('until-found');
    });

    it('combines topic filter with search and shows no-results state with Reset Search', () => {
        controller = attachHelpPage(root, { readLocation: false });
        const search = root.querySelector('[data-help-page-search]');
        const noResults = root.querySelector('[data-help-page-no-results]');
        const noResultsTerm = root.querySelector('[data-help-page-no-results-term]');
        const resetButton = root.querySelector('[data-help-page-reset]');

        controller.setTopic('getting-started');
        search.value = 'Takeout';
        search.dispatchEvent(new Event('input', { bubbles: true }));

        expect(noResults.hidden).toBe(false);
        expect(noResultsTerm.textContent).toBe('Takeout');

        resetButton.click();

        expect(controller.getTopic()).toBe('all');
        expect(controller.getQuery()).toBe('');
        expect(search.value).toBe('');
        expect(noResults.hidden).toBe(true);
        expect(document.activeElement).toBe(search);
        expect([...root.querySelectorAll('[data-help-page-section]')].every((section) => !section.hidden)).toBe(true);
    });

    it('keeps FAQ panels hidden until found and supports Expand All / Collapse All and beforematch', () => {
        controller = attachHelpPage(root, { readLocation: false });
        const toggleAll = root.querySelector('[data-help-page-faq-toggle]');
        const faqButtons = [...root.querySelectorAll('[data-help-page-faq-item] > button')];
        const faqPanels = [document.getElementById('faq-1'), document.getElementById('faq-2')];

        expect(faqPanels.every((panel) => panel.getAttribute('hidden') === 'until-found')).toBe(true);

        // Find-in-page beforematch expands the matching panel.
        faqPanels[0].dispatchEvent(new Event('beforematch'));
        expect(faqButtons[0].getAttribute('aria-expanded')).toBe('true');
        expect(faqPanels[0].hidden).toBe(false);

        // Expand All opens all FAQ items and updates the button label and aria-expanded.
        toggleAll.click();
        expect(faqButtons.every((button) => button.getAttribute('aria-expanded') === 'true')).toBe(true);
        expect(toggleAll.textContent).toBe('Collapse All');
        expect(toggleAll.getAttribute('aria-expanded')).toBe('true');

        // Second click collapses all FAQ items and restores hidden="until-found".
        toggleAll.click();
        expect(faqButtons.every((button) => button.getAttribute('aria-expanded') === 'false')).toBe(true);
        expect(faqPanels.every((panel) => panel.getAttribute('hidden') === 'until-found')).toBe(true);
        expect(toggleAll.textContent).toBe('Expand All');
        expect(toggleAll.getAttribute('aria-expanded')).toBe('false');
    });

    it('applies ?q= and ?topic= query parameters from route, location, or applyQuery and optionally syncs URL', () => {
        window.history.replaceState(null, '', '/help?topic=faq&q=sso');
        controller = attachHelpPage(root, { syncUrl: true });

        expect(controller.getTopic()).toBe('faq');
        expect(controller.getQuery()).toBe('sso');
        expect(root.querySelector('[data-help-page-search]').value).toBe('sso');
        expect(root.querySelector('[data-help-page-topic="faq"]').getAttribute('aria-pressed')).toBe('true');
        expect(document.getElementById('faq-1').hidden).toBe(false);
        expect(controller.getQueryString()).toBe('?topic=faq&q=sso');

        // Unknown topic falls back to all.
        controller.applyQuery('/help?topic=unknown-topic&q=');
        expect(controller.getTopic()).toBe('all');
        expect(window.location.search).toBe('');
    });

    it('updates feedback links and feedback addresses on attach and via setFeedback', () => {
        controller = attachHelpPage(root, {
            readLocation: false,
            feedback: {
                address: 'help@example.test',
                appName: 'Auth',
                version: 'v0.5.0',
                user: { name: 'Alex North', email: 'alex@example.test' }
            }
        });

        const link = root.querySelector('[data-help-page-feedback-link]');
        const address = root.querySelector('[data-help-page-feedback-address]');
        expect(address.textContent).toBe('help@example.test');
        expect(address.getAttribute('href')).toBe('mailto:help@example.test');
        expect(new URLSearchParams(link.href.split('?')[1]).get('body')).toContain('User: Alex North <alex@example.test>');

        controller.setFeedback({ user: null, version: '0.6.0' });
        const updated = new URLSearchParams(link.href.split('?')[1]);
        expect(updated.get('subject')).toBe('Auth Feedback (v0.6.0)');
        expect(updated.get('body')).toContain('User: (not signed in)');
    });

    it('mounts release notes from T0279 and includes them in search filtering', () => {
        controller = attachHelpPage(root, {
            readLocation: false,
            releases: SAMPLE_RELEASES
        });

        const releaseSection = root.querySelector('[data-help-page-topics="release-notes"]');
        expect(releaseSection.textContent).toContain('offline-cache');

        controller.setQuery('offline-cache');
        expect(releaseSection.hidden).toBe(false);
        expect(root.querySelector('[data-help-page-topics="getting-started"]').hidden).toBe(true);
    });

    it('removes listeners and destroys child controllers on destroy', () => {
        const onChange = vi.fn();
        controller = attachHelpPage(root, { readLocation: false, onChange, releases: SAMPLE_RELEASES });
        onChange.mockClear();

        controller.destroy();
        controller = null;

        root.querySelector('[data-help-page-topic="security"]').click();
        expect(onChange).not.toHaveBeenCalled();
    });
});

describe('createHelpPage', () => {
    let controller;

    beforeEach(() => {
        setSpriteUrl('../looks/neutral/icons.svg');
        window.history.replaceState(null, '', '/');
    });

    afterEach(() => {
        controller?.destroy();
        controller = null;
        document.body.innerHTML = '';
    });

    it('builds the help page skeleton safely and attaches full filtering, FAQ, feedback, and release notes', () => {
        controller = createHelpPage(document, {
            readLocation: false,
            header: { title: 'Help & Guides', text: 'Guides, FAQ, and release notes.' },
            topics: [
                { key: 'all', label: 'All Topics' },
                { key: 'support', label: 'Support' },
                { key: 'faq', label: 'FAQ' },
                { key: 'release-notes', label: 'Release Notes' }
            ],
            feedback: {
                address: 'support@example.test',
                appName: 'Demo',
                version: '1.0.0',
                user: { name: 'Alex', email: 'alex@example.test' }
            },
            releases: SAMPLE_RELEASES,
            sections: [
                {
                    id: 'support',
                    topics: ['support'],
                    title: 'Application & Support',
                    content: 'Contact us anytime <script>alert(1)</script>.',
                    feedback: { label: 'Send Feedback' }
                },
                {
                    id: 'faq',
                    topics: ['faq'],
                    title: 'Questions & Answers',
                    faq: {
                        items: [
                            {
                                id: 'q1',
                                question: 'How does sync work?',
                                answer: 'Changes replay automatically.',
                                tags: 'offline replay'
                            }
                        ]
                    }
                },
                {
                    id: 'changelog',
                    topics: ['release-notes'],
                    title: 'Release Notes',
                    releaseNotes: true
                }
            ]
        });

        document.body.append(controller.element);
        expect(controller.element.querySelector('script')).toBeNull();
        expect(controller.element.querySelector('[data-help-page-feedback-link]').href).toContain('Demo%20Feedback');
        expect(controller.element.querySelector('[data-help-page-faq-item] .collapsible__panel').getAttribute('hidden')).toBe('until-found');

        controller.setQuery('replay');
        expect(controller.element.querySelector('[data-help-page-faq-item] > button').getAttribute('aria-expanded')).toBe('true');
        expect(controller.element.querySelector('[data-help-page-topics="support"]').hidden).toBe(true);
    });
});
