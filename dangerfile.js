import { danger, fail, markdown, schedule, warn } from 'danger';
import { compact, includes, uniq } from 'lodash';

// Setup
const pr = danger.github.pr;
const modified = danger.git.modified_files;
const bodyAndTitle = (pr.body + pr.title).toLowerCase();

const trivialPR = bodyAndTitle.includes('#trivial');

const changelogChanges = includes(modified, 'CHANGELOG.md');
if (modifiedAppFiles.length > 0 && !trivialPR && !changelogChanges) {
  fail('No CHANGELOG added.');
}

const packageChanged = includes(danger.git.modified_files, 'package.json');
const lockfileChanged = includes(
  danger.git.modified_files,
  'package-lock.json',
);

if (packageChanged && !lockfileChanged) {
  const message =
    'Changes were made to package.json, but not to package-lock.json';
  const idea = 'Perhaps you need to run `npm install`?';
  warn(`${message} - <i>${idea}</i>`);
}
