import { Ref, Remote } from '../app';

const defaultFilterRegex = new RegExp('');
const defaultSearchRegex = new RegExp('^$');

export const getState = (logger: any) => {
  // State variables
  const stateObject = {
    currentRemoteIndex: 0,
    currentRemote: null as Remote | null,
    filterRegex: defaultFilterRegex,
    searchHits: [] as number[],
    searchRegex: defaultSearchRegex,
    remotes: [] as Remote[],
  };

  return {
    get currentRemote(): Remote | null {
      return stateObject.currentRemote;
    },

    get currentRemoteIndex(): number {
      return stateObject.currentRemoteIndex;
    },

    get filterRegex(): RegExp {
      return stateObject.filterRegex;
    },

    get remotes(): Remote[] {
      return stateObject.remotes;
    },

    get searchHits(): number[] {
      return stateObject.searchHits;
    },

    get searchRegex(): RegExp {
      return stateObject.searchRegex;
    },

    setCurrentRemoteIndex(newIndex: number): void {
      stateObject.currentRemoteIndex = newIndex;
      stateObject.currentRemote = stateObject.remotes[newIndex];
    },

    setFilter(newFilter: string): void {
      try {
        stateObject.filterRegex = new RegExp(newFilter, 'gi');
      } catch (error) {
        logger.error(error.message);

        stateObject.filterRegex = defaultFilterRegex;
      }
    },

    setSearch(newSearch: string): void {
      try {
        stateObject.searchRegex = new RegExp(newSearch, 'gi');
      } catch (error) {
        logger.error(error.message);

        stateObject.searchRegex = defaultFilterRegex;
      }

      if (!newSearch) {
        stateObject.searchHits = [];
        return;
      }

      stateObject.searchHits = stateObject.currentRemote.refs
        .filter(ref => ref.name.search(stateObject.filterRegex) !== -1)
        .map((ref, index) => {
          if (ref.name.search(stateObject.searchRegex) !== -1) {
            return index + 1;
          }

          return NaN;
        })
        .filter(index => !isNaN(index));
    },

    setRemotes(newRemotes: Remote[]): void {
      stateObject.remotes = newRemotes;
    },
  };
};
