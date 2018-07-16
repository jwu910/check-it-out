# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### Notes Template
Each issue fixed should contain one bullet summarizing the work done.

```
* [CIO-###](https://github.com/jwu910/check-it-out/issues/###) Description of work done
```

<hr />

## [Unreleased]
* [CIO-207](https://github.com/jwu910/check-it-out/issues/207) Changed homepage url in package json.
* [CIO-194](https://github.com/jwu910/check-it-out/issues/194) Added [Danger](https://danger.systems) to CIO.
* [CIO-210](https://github.com/jwu910/check-it-out/issues/210) Added regex for Danger rules.
* [CIO-213](https://github.com/jwu910/check-it-out/issues/213) Set up build stages for [TravisCI](https://travis-ci.org).
* [CIO-153](https://github.com/jwu910/check-it-out/issues/153) Add code of conduct.
* [CIO-217](https://github.com/jwu910/check-it-out/issues/217) Update readme regarding windows compatibility.
* [CIO-206](https://github.com/jwu910/check-it-out/issues/206) Update gifs.
* [CIO-221](https://github.com/jwu910/check-it-out/issues/221) Update readme with new `<kbd>` elements.
* [CIO-102](https://github.com/jwu910/check-it-out/issues/102) Add configurable options for user.
* [CIO-226](https://github.com/jwu910/check-it-out/issues/226) Change git log config from single string to array of strings. Breaks git log
* [CIO-227](https://github.com/jwu910/check-it-out/issues/227) Update git log gif
* [CIO-212](https://github.com/jwu910/check-it-out/issues/212) Change refresh hotkey from <kbd>r</kbd> to <kbd>Ctrl</kbd>+<kbd>r</kbd>
* [CIO-230](https://github.com/jwu910/check-it-out/issues/230) Add case for flag `--reset-config` to reset Check It Out to defaults
* [CIO-205](https://github.com/jwu910/check-it-out/issues/205) Update table header name.
* [CIO-235](https://github.com/jwu910/check-it-out/issues/235) Change Dangerfile. PR to master will fail.


## [[0.8.0]](https://github.com/jwu910/check-it-out/releases/tag/v0.8.0) - 2018-07-05
### Notes
This release *should* make CIO faster. We added loading text so when you're working on a pretty large project, you're not stuck there wondering if you pressed enter or not.

### Added
* [CIO-187](https://github.com/jwu910/check-it-out/issues/187) Added stale bot to CIO.

### Changed
* [CIO-196](https://github.com/jwu910/check-it-out/issues/196) Changed how remotes were being listed

### Removed
* [CIO-190](https://github.com/jwu910/check-it-out/issues/190) Removed redux dependency.

### Fixed
* [CIO-56](https://github.com/jwu910/check-it-out/issues/56) Fixed the the way we parsed branch names to account for grouped branch names. Grouped branch names now display correctly.
* [CIO-200](https://github.com/jwu910/check-it-out/issues/200) Fixed regression bug where pressing `[r]` did not refresh the branches and made sure loading text displays while CIO awaiting git response.

