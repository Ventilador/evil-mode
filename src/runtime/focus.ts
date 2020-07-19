import { DocumentState } from "../types/something";
import { Vim } from "../types/api";

export function focus(state: DocumentState, vim: Vim) {
    vim.vim_set_current_tabpage(state.tabpage());
}
