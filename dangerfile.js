'use strict';

const includes = require('lodash.includes');

const { danger, fail, markdown, message, warn } = require('danger');

const jsModifiedFiles = danger.git.modified_files.filter(
  path => path.startsWith('src') && path.endsWith('js'),
);

const hasAppChanges =
  jsModifiedFiles.filter(filepath => !filepath.endsWith('test.js')).length > 0;

const prBodyMsg = danger.github.pr.body;

const titleRegex = /^([A-Z]{3,}-)([0-9]+)/;
const bodyRegex = /^Fixes #([0-9]+)/;

console.log(danger.github.pr.title.match(titleRegex));
message('Checked by Danger');

// Fails if PR's title does not start with ticket abbreviation.
if (!danger.github.pr.title.match(titleRegex)) {
  fail(
    ':grey_question: This pull request title should match the ticket format "CIO-1234"',
  );
}

// Fails if the description does not contain regex.
if (!prBodyMsg || prBodyMsg.length < 8 || prBodyMsg.match(bodyRegex)) {
  fail(
    ':grey_question: This pull request needs a description. \n' +
      'Please include "Fixes #<ISSUE_NUMBER>". \n' +
      'See <a href="https://github.com/jwu910/check-it-out/blob/master/CONTRIBUTING.md">Contributing Guidelines</a>',
  );
}

// Warns if package lock was not updated.
const packageChanged = includes(danger.git.modified_files, 'package.json');
const lockfileChanged = includes(
  danger.git.modified_files,
  'package-lock.json',
);
if (packageChanged && !lockfileChanged) {
  const message =
    'Changes were made to package.json, but not to package-lock.json';
  const idea =
    'Perhaps you need to run `npm install`? \n' +
    'Package Lock files can be commited with  the message `CIO-#<ISSUE_NUMBER> Autogenerate package-lock`';
  warn(`${message} - <i>${idea}</i>`);
}

// Fail if there are app changes without a CHANGELOG
if (!danger.git.modified_files.includes('CHANGELOG.md') && hasAppChanges) {
  const changelogLink =
    'https://github.com/jwu910/check-it-out/blob/master/CHANGELOG.md';
  fail(
    `Please include a CHANGELOG entry. You can find it at <a href='${changelogLink}'>CHANGELOG.md</a>`,
  );
}

// Always ensure we assign someone, so that our Slackbot can do its work correctly
if (danger.github.pr.assignee === null) {
  fail(
    'Please assign someone to merge this PR, and optionally include people who should review.',
  );
}
