import { beforeEach, expect, it } from 'vitest';
import { setCatalog, t } from '../../src/js/i18n.js';

beforeEach(() => setCatalog({}));

it('returns missing keys without inherited object properties', () => {
    expect(t('common.missing')).toBe('common.missing');
    expect(t('toString')).toBe('toString');
});

it('interpolates repeated own parameters and preserves unknown placeholders', () => {
    setCatalog({ 'common.greeting': '{user-name} {user_name} {count} {count} {unknown} {toString}' });
    expect(t('common.greeting', { 'user-name': 'Ada', user_name: 'Lovelace', count: 0 }))
        .toBe('Ada Lovelace 0 0 {unknown} {toString}');
});

it('copies and replaces catalogs, preserving empty strings and literal HTML', () => {
    const catalog = { 'common.save': '<b>Save</b>', 'common.empty': '' };
    setCatalog(catalog);
    catalog['common.save'] = 'changed';
    expect(t('common.save')).toBe('<b>Save</b>');
    expect(t('common.empty')).toBe('');
    setCatalog({ 'common.save': 'Opslaan' });
    expect(t('common.save')).toBe('Opslaan');
    expect(t('common.empty')).toBe('common.empty');
});

it.each([null, [], 'catalog', { nested: {} }, { count: 1 }, { missing: undefined }])
('rejects invalid catalogs atomically: %j', catalog => {
    setCatalog({ 'common.save': 'Save' });
    expect(() => setCatalog(catalog)).toThrow(TypeError);
    expect(t('common.save')).toBe('Save');
});
