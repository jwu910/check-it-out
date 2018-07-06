const { message, warn, fail, markdown } = require('danger');

const hasChangelog = includes(danger.git.modified_files, 'CHANGELOG.md');
const isTrivial = contains(
  danger.github.pr.body + danger.github.pr.title,
  '#trivial',
);

if (!hasChangelog && !isTrivial) {
  warn('Please add a changelog entry for your changes.');
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
