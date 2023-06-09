import { Widgets } from "blessed";

export interface ListTable extends Widgets.ListTableElement {
  selected: number;
  items: Widgets.BlessedElement[];
}

export interface Logger {
  error(message: string): void;
  log(message: string): void;
}

export interface Ref {
  active: boolean;
  id: number;
  name: string;
  remoteName: string;
}

export interface Remote {
  name: string;
  refs: Ref[];
}

export interface InternalState {
  currentRemoteIndex: number;
  currentRemote: Remote;
  filterRegex: RegExp;
  searchHits: number[];
  searchRegex: RegExp;
  remotes: Remote[];
}

export interface State extends InternalState {
  setCurrentRemoteIndex(index: number): void;
  setFilter(newFilter: string): void;
  setSearch(newSearch: string): void;
  setRemotes(newRemotes: Remote[]): void;
}
