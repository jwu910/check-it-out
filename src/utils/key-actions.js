export const getPrevRemote = (currentRemote, remoteList) => {
  let currIndex = remoteList.indexOf(currentRemote);

  if (currIndex > 0) {
    currIndex -= 1;
  }

  currentRemote = remoteList[currIndex];

  refreshTable(currentRemote);

  return currentRemote;
}

export const getNextRemote = (currentRemote, remoteList) => {
  let currIndex = remoteList.indexOf(currentRemote);

  if (currIndex < remoteList.length - 1) {
    currIndex += 1;
  }

  currentRemote = remoteList[currIndex];

  refreshTable(currentRemote);

  return currentRemote;
}
