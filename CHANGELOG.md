# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Sending a PR?

Summarize your code changes in a single line and use the Issue Template below to generate the changelog entry to reference the ticket that was worked on. Keep it simple, keep it sweet.

### Issue Template

Each issue fixed should contain one bullet summarizing the work done.

```
- [CIO-###](https://github.com/jwu910/check-it-out/issues/###) Short description of work done
```

### Release Template

```
## [[###]](https://github.com/jwu910/check-it-out/releases/tag/v###) - YYYY-MM-DD
### Notes

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security
```

<hr />

## [Unreleased]

- [CIO-315](https://github.com/jwu910/check-it-out/issues/315) Make CIO commitizen friendly
- [CIO-413](https://github.com/jwu910/check-it-out/issues/413) Update dependabot configs

<hr />

## [[2.0.3]](https://github.com/jwu910/check-it-out/releases/tag/v2.0.3) - 2019-02-25

### Notes

Clean up some WET code

### Changed

- [CIO-313](https://github.com/jwu910/check-it-out/issues/313) Fix similar code in utils/git.js

<hr />

## [[2.0.2]](https://github.com/jwu910/check-it-out/releases/tag/v2.0.2) - 2019-02-20

### Notes

Minor updates and documentation

### Changed

- [CIO-320](https://github.com/jwu910/check-it-out/issues/320) Write better documentation
- [CIO-316](https://github.com/jwu910/check-it-out/issues/316) Add LGTM badge to readme
- [CIO-328](https://github.com/jwu910/check-it-out/issues/328) Add code climate badget to readme

### Fixed

- [CIO-312](https://github.com/jwu910/check-it-out/issues/312) Fix similar code block

<hr />

## [[2.0.1]](https://github.com/jwu910/check-it-out/releases/tag/v2.0.1) - 2019-02-14

### Notes

Patch release to fix a minor bug where loading screen disappears on larger projects

### Added

- CIO-0 Update project configs relating to update-notifier and dependabot

### Fixed

- [CIO-257](https://github.com/jwu910/check-it-out/issues/257) Fix append order to address missing load screen bug

<hr />

## [[2.0.0]](https://github.com/jwu910/check-it-out/releases/tag/v2.0.0) - 2019-02-11

### Notes

This release fixes github-flagged security issues, adds in a message center to help log some CIO activity, and sets up the codebase for some future features.
Unfortunately with this release, we'll be losing support for node 4 and node 5 due to a bump in major versions of Babel.
Looking forward to 2.1.0, we can expect to see the ability to filter branches.

### Added

- CIO-0 Add CODEOWNERS
- [CIO-277](https://github.com/jwu910/check-it-out/issues/277) Add status bar container interface
- [CIO-280](https://github.com/jwu910/check-it-out/issues/280) Add message center and replace message interface

### Removed

- [CIO-296](https://github.com/jwu910/check-it-out/issues/296) Remove screen title property from interface

### Security

- [CIO-281](https://github.com/jwu910/check-it-out/issues/281) Update multiple dependencies to resolve vulnerabilities

<hr />

## [[1.0.2]](https://github.com/jwu910/check-it-out/releases/tag/v1.0.2) - 2018-10-05

### Notes

Added CIO to some issue aggregating sites. Pretty neat! Started utilizing [hactoberfest](https://hacktoberfest.digitalocean.com/) tags as well as [first-timers-only](https://www.firsttimersonly.com/) tags to get some of the lighter issues some visibility.

### Added

- [CIO-259](https://github.com/jwu910/check-it-out/issues/259) User can now terminate loading states with escape hotkeys (q, esc, C-c)
- [CIO-260](https://github.com/jwu910/check-it-out/issues/260) Add first-timers-only badge to readme

### Changed

- [CIO-268](https://github.com/jwu910/check-it-out/issues/268) Add pull request template
- [CIO-271](https://github.com/jwu910/check-it-out/issues/271) Add 'format' to npm scripts to invoke [prettier](https://prettier.io)

<hr />

## [[1.0.1]](https://github.com/jwu910/check-it-out/releases/tag/v1.0.1) - 2018-09-17

- [CIO-252](https://github.com/jwu910/check-it-out/issues/252) Update logo url

<hr />

## [[1.0.0]](https://github.com/jwu910/check-it-out/releases/tag/v1.0.0) - 2017-09-10

### Notes

Minor bug fix and add CIO logo.

Roadmap: Add gh-page source code back into master branch and use (probably) gatsby for their templating abilities to hopefully streamline updating the readme -> gh-page conversion.

### Added

- [CIO-244](https://github.com/jwu910/check-it-out/issues/244) Add logo and theme palette from openlogo contest

### Fixed

- [CIO-247](https://github.com/jwu910/check-it-out/issues/247) Add spinner to check out process and fix missing loading spinner from startup

<hr />

## [[0.9.2]](https://github.com/jwu910/check-it-out/releases/tag/v0.9.2) - 2018-07-19

### Notes

Some minor changes in preparation for 1.0.0

### Added

- [CIO-203](https://github.com/jwu910/check-it-out/issues/203) Add configuration for sort date option

### Changed

- [CIO-198](https://github.com/jwu910/check-it-out/issues/198) Change function declarations to const

### Fixed

- [CIO-120](https://github.com/jwu910/check-it-out/issues/120) Fix table width to show scrollbar

<hr />

## [[0.9.1]](https://github.com/jwu910/check-it-out/releases/tag/v0.9.1) - 2018-07-16

### Notes

Found some documentation issues. Had to update readme image paths. Currently NPM does not have a way to update the readme on npmjs.org without publishing a patch. If I am wrong, please let me know. Thanks everyone!

<hr />

## [[0.9.0]](https://github.com/jwu910/check-it-out/releases/tag/v0.9.0) - 2018-07-16

### Notes

### Added

- [CIO-102](https://github.com/jwu910/check-it-out/issues/102) Add configurable options for user.
- [CIO-153](https://github.com/jwu910/check-it-out/issues/153) Add code of conduct.
- [CIO-194](https://github.com/jwu910/check-it-out/issues/194) Added [Danger](https://danger.systems) to CIO.
- [CIO-210](https://github.com/jwu910/check-it-out/issues/210) Added regex for Danger rules.
- [CIO-213](https://github.com/jwu910/check-it-out/issues/213) Set up build stages for [TravisCI](https://travis-ci.org).
- [CIO-230](https://github.com/jwu910/check-it-out/issues/230) Add case for flag `--reset-config` to reset Check It Out to defaults

### Changed

- [CIO-205](https://github.com/jwu910/check-it-out/issues/205) Update table header name.
- [CIO-206](https://github.com/jwu910/check-it-out/issues/206) Update gifs.
- [CIO-207](https://github.com/jwu910/check-it-out/issues/207) Changed homepage url in package json.
- [CIO-212](https://github.com/jwu910/check-it-out/issues/212) Change refresh hotkey from <kbd>r</kbd> to <kbd>Ctrl</kbd>+<kbd>r</kbd>
- [CIO-217](https://github.com/jwu910/check-it-out/issues/217) Update readme regarding windows compatibility.
- [CIO-221](https://github.com/jwu910/check-it-out/issues/221) Update readme with new `<kbd>` elements.
- [CIO-226](https://github.com/jwu910/check-it-out/issues/226) Change git log config from single string to array of strings. Breaks git log
- [CIO-227](https://github.com/jwu910/check-it-out/issues/227) Update git log gif

### Fixed

- [CIO-235](https://github.com/jwu910/check-it-out/issues/235) Change Dangerfile. PR to master will fail.

<hr />

## [[0.8.0]](https://github.com/jwu910/check-it-out/releases/tag/v0.8.0) - 2018-07-05

### Notes

This release _should_ make CIO faster. We added loading text so when you're working on a pretty large project, you're not stuck there wondering if you pressed enter or not.

### Added

- [CIO-187](https://github.com/jwu910/check-it-out/issues/187) Added stale bot to CIO.

### Changed

- [CIO-196](https://github.com/jwu910/check-it-out/issues/196) Changed how remotes were being listed

### Removed

- [CIO-190](https://github.com/jwu910/check-it-out/issues/190) Removed redux dependency.

### Fixed

- [CIO-56](https://github.com/jwu910/check-it-out/issues/56) Fixed the the way we parsed branch names to account for grouped branch names. Grouped branch names now display correctly.
- [CIO-200](https://github.com/jwu910/check-it-out/issues/200) Fixed regression bug where pressing `[r]` did not refresh the branches and made sure loading text displays while CIO awaiting git response.

```

```
