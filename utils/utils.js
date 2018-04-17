/**
 * Function should build a separate array for each unique remote
 */
async function buildRemotePayload(output) {
  var payload = {};

  const remoteList = filterUniqueRemotes(output);

  remoteList.forEach(branch => {
    payload[branch] = [];
  });

  output.forEach(remote => {
    payload[remote[1]].push(remote);
  });

  return payload;
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function filterUniqueRemotes(output) {
  var remoteList = [];

  output.forEach(remote => {
    remoteList.push(remote[1]);
  });

  remoteList = remoteList.filter(onlyUnique).sort();

  return remoteList
}

module.exports = {
  buildRemotePayload,
  filterUniqueRemotes,
  onlyUnique
}
