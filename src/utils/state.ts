import { InternalState, Logger, State, Remote } from "../types.js";

const defaultFilterRegex = new RegExp("");
const defaultSearchRegex = new RegExp("^$");

export const getState = (logger: Logger): State => {
  // State variables
  const stateObject: InternalState = {
    currentRemoteIndex: 0,
    currentRemote: { name: "", refs: [] },
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
    setCurrentRemoteIndex(newIndex: number) {
      stateObject.currentRemoteIndex = newIndex;
      stateObject.currentRemote = stateObject.remotes[newIndex];
    },

    /** @type {(string) => void} */
    setFilter(newFilter: string) {
      try {
        stateObject.filterRegex = new RegExp(newFilter, "gi");
      } catch (error) {
        logger.error((error as Error).message);

        stateObject.filterRegex = defaultFilterRegex;
      }
    },

    /** @type {(string) => void} */
    setSearch(newSearch: string) {
      try {
        stateObject.searchRegex = new RegExp(newSearch, "gi");
      } catch (error) {
        logger.error((error as Error).message);

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
    setRemotes(newRemotes: Remote[]) {
      stateObject.remotes = newRemotes;
    },
  };
};
