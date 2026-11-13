# Validation proof

## Walkthrough & Validation

Command: `python scripts/devops.py check`; exit code: 0.

Fast suite excerpt:

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0035-move-field-and-form-announcements-to-the-shared
 Test Files  29 passed (29)
      Tests  2108 passed (2108)
   Start at  05:58:25
   Duration  6.29s (environment 56%, import 28%, tests 11%, transform 3%, worker 1%)
    Isolate  29 workers spawned · ~888ms startup each (spawn + environment, per file)
             at least ~2.79s faster with isolate: false — reuses workers across files instead of one per file
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
```

Final suite summaries:

```text
  2 skipped
  614 passed (4.0m)
 Test Files  2 passed (2)
      Tests  4 passed (4)
   Duration  4.80s (tests 98%, import 1%, transform 1%)
```

Final output:

```text
[... 245 lines omitted ...]
npm notice 1.2kB src/looks/bright/primitives.css
npm notice 447B src/looks/neutral/fonts.css
npm notice 352.2kB src/looks/neutral/fonts/InterVariable.woff2
npm notice 4.4kB src/looks/neutral/fonts/OFL.txt
npm notice 5.8kB src/looks/neutral/icons.svg
npm notice 184B src/looks/neutral/index.css
npm notice 4.9kB src/looks/neutral/look.css
npm notice 1.3kB src/looks/neutral/primitives.css
npm notice 3.1kB src/looks/warm/fonts.css
npm notice 20.8kB src/looks/warm/fonts/dm-sans/dm-sans-latin-ext-wght-italic.woff2
npm notice 18.2kB src/looks/warm/fonts/dm-sans/dm-sans-latin-ext-wght-normal.woff2
npm notice 39.7kB src/looks/warm/fonts/dm-sans/dm-sans-latin-wght-italic.woff2
npm notice 36.9kB src/looks/warm/fonts/dm-sans/dm-sans-latin-wght-normal.woff2
npm notice 4.6kB src/looks/warm/fonts/dm-sans/OFL.txt
npm notice 4.5kB src/looks/warm/fonts/outfit/OFL.txt
npm notice 14.8kB src/looks/warm/fonts/outfit/outfit-latin-ext-wght-normal.woff2
npm notice 32.3kB src/looks/warm/fonts/outfit/outfit-latin-wght-normal.woff2
npm notice 7.6kB src/looks/warm/icons.svg
npm notice 184B src/looks/warm/index.css
npm notice 7.2kB src/looks/warm/look.css
npm notice 2.4kB src/looks/warm/primitives.css
npm notice Tarball Details
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.1.0-pre
npm notice filename: gpellicciotta-support.webapp-0.1.0-pre.tgz
npm notice package size: 937.5 kB
npm notice unpacked size: 1.2 MB
npm notice shasum: 78af214468aa98bd1a78531259a98f85174fab29
npm notice integrity: sha512-wt1pPXXsdReko[...]2MxN2agOwyACg==
npm notice total files: 103
npm notice
gpellicciotta-support.webapp-0.1.0-pre.tgz
```



Focused green command: `npx vitest run tests/unit/field.test.js tests/unit/form.test.js tests/unit/live-region.test.js tests/unit/toast.test.js`.
Exit code: 0.

```text
RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0035-move-field-and-form-announcements-to-the-shared


 Test Files  4 passed (4)
      Tests  63 passed (63)
   Start at  05:59:22
   Duration  3.35s (import 44%, environment 44%, tests 11%, transform 1%, worker 1%)
```

Command: `npx vitest run tests/unit/field.test.js tests/unit/form.test.js`; exit code: 1.

```text

 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0035-move-field-and-form-announcements-to-the-shared

 ❯ tests/unit/form.test.js (12 tests | 1 failed) 263ms
   ❯ attachForm (8)
     × shares field errors and busy messages with the page announcer 38ms
 ❯ tests/unit/field.test.js (17 tests | 1 failed) 310ms
   ❯ createField (5)
     × announces through a shared polite live region when no announcer is given 32ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/field.test.js > createField > announces through a shared polite live region when no announcer is given
AssertionError: expected <div role="status" …(4)></div>
…(1) to have a length of 1 but got 2

- Expected
+ Received

- 1
+ 2

 ❯ tests/unit/field.test.js:118:29
    116|             vi.runAllTimers();
    117|             const regions = doc.querySelectorAll('[aria-live="polite"]…
    118|             expect(regions).toHaveLength(1);
       |                             ^
    119|             expect(regions[0].textContent).toBe('Enter B.');
    120|             expect(regions[0].dataset.liveRegion).toBe('polite');

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  tests/unit/form.test.js > attachForm > shares field errors and busy messages with the page announcer
AssertionError: expected <div role="status" …(4)></div>
…(1) to have a length of 1 but got 2

- Expected
+ Received

- 1
```

```text
+ 2

 ❯ tests/unit/form.test.js:61:62
     59|         const controller = attachForm(form, { document: doc, fields });
     60|         expect(await controller.submit()).toBe(false);
     61|         expect(doc.querySelectorAll('[aria-live="polite"]')).toHaveLen…
       |                                                              ^
     62|         name.value = 'Steps';
     63|         url.value = 'Address';

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  2 failed (2)
      Tests  2 failed | 27 passed (29)
   Start at  05:57:24
   Duration  1.41s (import 70%, tests 24%, transform 6%, worker 1%)
```
