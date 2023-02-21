/**
 * @typedef {import('../app').Ref} Ref
 * @typedef {import('../app').Remote} Remote
 */

const defaultFilterRegex = new RegExp("");
const defaultSearchRegex = new RegExp("^$");

export const getState = (logger) => {
  // State variables
  const stateObject = {
    currentRemoteIndex: 0,
    currentRemote: null,
    filterRegex: defaultFilterRegex,
    searchHits: [],
    searchRegex: defaultSearchRegex,
    remotes: [],
  };

  return {
    /** @type {Remote} */
    get currentRemote() {
      return stateObject.currentRemote;
    },

    /** @type {number} */
    get currentRemoteIndex() {
      return stateObject.currentRemoteIndex;
    },

    /** @type {RegExp} */
    get filterRegex() {
      return stateObject.filterRegex;
    },

    /** @type {Remote[]} */
    get remotes() {
      return stateObject.remotes;
    },

    /** @type {number[]} */
    get searchHits() {
      return stateObject.searchHits;
    },

    /** @type {RegExp} */
    get searchRegex() {
      return stateObject.searchRegex;
    },

    /** @type {(number) => void} */
    setCurrentRemoteIndex(newIndex) {
      stateObject.currentRemoteIndex = newIndex;
      stateObject.currentRemote = stateObject.remotes[newIndex];
    },

    /** @type {(string) => void} */
    setFilter(newFilter) {
      try {
        stateObject.filterRegex = new RegExp(newFilter, "gi");
      } catch (error) {
        logger.error(error.message);

        stateObject.filterRegex = defaultFilterRegex;
      }
    },

    /** @type {(string) => void} */
    setSearch(newSearch) {
      try {
        stateObject.searchRegex = new RegExp(newSearch, "gi");
      } catch (error) {
        logger.error(error.message);

        stateObject.searchRegex = defaultFilterRegex;
      }

      if (!newSearch) {
        stateObject.searchHits = [];
        return;
      }

      stateObject.searchHits = stateObject.currentRemote.refs
        .filter((ref) => ref.name.search(stateObject.filterRegex) !== -1)
        .map((ref, index) => {
          if (ref.name.search(stateObject.searchRegex) !== -1) {
            return index + 1;
          }

          return NaN;
        })
        .filter((index) => !isNaN(index));
    },

    /** @type {(newRemotes: Remote[]) => void} */
    setRemotes(newRemotes) {
      stateObject.remotes = newRemotes;
    },
  };
};
