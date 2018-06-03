import * as blessed from 'blessed';

export const statusBar = () => {
  const statusBar = blessed.box({
    border: false,
    bottom: 0,
    height: 1,
    width: '100%',
  });

  statusBar.append(statusBarText);
  statusBar.append(statusHelpText);


  return statusBar;
}
