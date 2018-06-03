import * as blessed from 'blessed';
import { toggleHelp } from './help-dialogue';
import { getRefs } from '../utils/refsUtils';

export const getScreen = () => {
  const screen = blessed.screen({
    autoPadding: true,
    fullUnicode: true,
    smartCSR: true,
    title: 'Check It Out',
  });

  screen.key('?', toggleHelp);
  screen.key('r', getRefs);
  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

  screen.append(refsListTable);
  screen.append(statusBar);
  screen.append(helpDialogue);

  return screen;
}
