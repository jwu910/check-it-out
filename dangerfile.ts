import { danger, fail, warn, message } from 'danger';

const pr = danger.github.pr;

const modified = danger.git.modified_files;
const bodyAndTitle = (pr.body + pr.title).toLowerCase();

const trivialPR = bodyAndTitle.includes('#trivial');
const filesOnly = (file: string) => file.endsWith('/');

const touchedFiles = modified
  .concat(danger.git.created_files)
  .filter(p => filesOnly(p));

// No empty assignee
if (!pr.assignee && pr.user.login !== 'jwu910') {
  const method = pr.title.includes('WIP') ? warn : fail;

  method(
    'This pull request needs an assignee, and optionally include any reviewers.',
  );
}

// No empty descriptions
if (pr.body.length < 10) {
  fail('This pull request needs a description.');
}

// No empty title
if (pr.title.length < 3) {
  fail('This pull request needs a title.');
}

// No empty changelog
const changelogChanges = modified.find(f => f === 'CHANGELOG.md');

if (modified.length > 0 && !trivialPR && !changelogChanges) {
  fail('No CHANGELOG added.');
}

// First timers only
if (
  pr.author_association === 'FIRST_TIMER' ||
  pr.author_association === 'FIRST_TIME_CONTRIBUTOR'
) {
  message(
    'Thank you for the pull request and congratulations on your first PR to this repo!',
  );
}

// Warn renamed files
const renamedFiles = danger.git.renamed_files;

if (renamedFiles) {
  warn('Renamed files were found.');
}
