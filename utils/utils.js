/**
 * Function should build a separate array for each unique remote
 *
 * @param {Array} output Array containing an array of branch information
 * @return {Object} Object with key-value pairs of remote-branchArray
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

/**
 * Find unique remotes in repository
 *
 * @param {Array} output Array containing an array of branch information
 * @return {Array} Array containing a unique set of remotes for this repository
 */
function filterUniqueRemotes(output) {
  var remoteList = [];

  output.forEach(remote => {
    remoteList.push(remote[1]);
  });

  remoteList = remoteList.filter(onlyUnique).sort();

  return remoteList;
}

module.exports = {
  buildRemotePayload,
  filterUniqueRemotes,
  onlyUnique,
};
