import chalk from 'chalk';
import Configstore from 'configstore';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';

/**
 * @typedef {import('../app').Ref} Ref
 * @typedef {import('../app').Remote} Remote
 */

interface Ref {
  active: boolean;
  id: number;
  name: string;
  remoteName: string;
}

interface Remote {
  name: string;
  refs: Ref[];
}

const pkg = require(path.resolve(__dirname, '../../package.json'));

const conf = new Configstore(pkg.name);

let gitResponse: ChildProcess;

/**
 * Kill the most recently created child process
 * Used to force exit from loading box
 */
export const closeGitResponse = (): void => {
  gitResponse.kill();
};

/**
 * Get references and parse through data to build branch array and remote list
 *
 * @returns {Promise<Remote[]>} payload and uniqueRemotes
 */
export const getRefData = async (): Promise<Remote[]> => {
  const refs = await getRefs();

  const remotes: Remote[] = [];

  for (const ref of refs) {
    let remote = remotes.find((remote) => remote.name === ref.remoteName);

    if (remote === undefined) {
      remote = { name: ref.remoteName, refs: [] };

      remotes.push(remote);
    }

    remote.refs.push(ref);
  }

  return remotes;
};

/**
 * Pull branch information from selection and pass as args to execGit().
 *
 * Returns a promise that resolves when the user has successfully checked out
 * target branch
 */
export const doCheckoutBranch = (
  branch: string,
  remote?: string
): Promise<string> => {
  let branchPath = '';

  if (remote && remote !== 'local' && remote !== 'origin') {
    branchPath = [remote, branch].join('/');
  } else {
    branchPath = branch;
  }

  const args = ['checkout', branchPath];

  return execGit(args);
};

/**
 * Return name of current branch.
 *
 * Returns a promise that resolves to the current branch name.
 */
export const getCurrentBranch = (): Promise<string> => {
  const args = ['rev-parse', '--abbrev-ref', 'HEAD'];

  return execGit(args);
};

/**
 * Execute git command with passed arguments.
 * <args> is expected to be an array of strings.
 * Example: ['fetch', '-pv']
 */
const execGit = (args: string[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    let dataString = '';
    let errorString = '';

    gitResponse = spawn('git', args);

    gitResponse.stdout.setEncoding('utf8');
    gitResponse.stderr.setEncoding('utf8');

    gitResponse.stdout.on('data', (data) => (dataString += data));
    gitResponse.stderr.on('data', (data) => (errorString += data));

    gitResponse.on('exit', (code, signal) => {
      if (code === 0) {
        resolve(dataString.toString());
      } else if (signal === 'SIGTERM') {
        reject(signal);
      } else if (errorString.toString().includes('unknown field name')) {
        reject(
          errorString.toString() +
            'Unable to resolve git call. \n' +
            'Check custom configs at your Check It Out configuration path, or call Check It Out with the following flag to reset to default configs: ' +
            chalk.bold('--reset-config')
        );
      } else {
        reject(errorString.toString());
      }
    });
  });
};

/**
 * Call git fetch with a prune and quiet flag.
 *
 * Return a promise that resolves when a user successfully fetches.
 */
export const doFetchBranches = (): Promise<string> => {
  const args = ['fetch', '-pq'];

  return execGit(args);
};

/**
 * Format output from getBranchesFrom() and return an array of arrays containing
 * formatted lines for the data table.
 *
 * @param {String} output String list of each ref associated with repository
 * @return {Promise<Array<Ref>>} Array containing an array of line items representing branch information
 */
export const formatRemoteBranches = async (
  output: string
): Promise<Ref[]> => {
  let remoteBranchArray: Ref[] = [];

  const selectedBranch = await getCurrentBranch();

  const outputArray = output.trim().split('\n');

  outputArray.map((line, index) => {
    const currLine = line.split('/');

    const currBranch =
      currLine[1] === 'remotes'
        ? currLine.slice(3).join('/')
        : currLine.slice(2).join('/');

    const currRemote = currLine[1] === 'remotes' ? currLine[2] : currLine[1];

    const active =
      currLine[1] === 'heads' && currBranch === selectedBranch.trim();

    const selected = active ? '*' : ' ';

    if (currLine[currLine.length - 1] === 'HEAD') {
      return;
    } else if (currLine[1] === 'stash') {
      return;
    }

    remoteBranchArray.push({
      active,
      id: index,
      name: currBranch,
      remoteName: currRemote,
    });
  });

  return remoteBranchArray;
};

/**
 * Print all refs assicated with git repository.
 *
 * @return {Promise<Ref[]>} String list of each ref associated with repository.
 */
const getRefs = async (): Promise<Ref[]> => {
  const args = [
    'for-each-ref',
    `--sort=${conf.get('sort')}`,
    '--format=%(refname)',
    '--count=500',
  ];

  return formatRemoteBranches(await execGit(args));
};
