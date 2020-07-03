import { NeovimClient } from 'neovim';
export type Keystroke = {
	pretty: string;
	text: string;
	keycode: number;
	modifier: Modifier[];
};

export type Modifier = 'shift' | 'ctrl' | 'alt';
export interface Vim extends NeovimClient {
	on(eventName: "mode_info_set", cb: (enabled: boolean, cursor_styles: any[]) => any): this
	on(eventName: "update_menu", cb: () => any): this
	on(eventName: "busy_start", cb: () => any): this
	on(eventName: "busy_stop", cb: () => any): this
	on(eventName: "mouse_on", cb: () => any): this
	on(eventName: "mouse_off", cb: () => any): this
	on(eventName: "mode_change", cb: (mode: string, mode_idx: number) => any): this
	on(eventName: "bell", cb: () => any): this
	on(eventName: "visual_bell", cb: () => any): this
	on(eventName: "flush", cb: () => any): this
	on(eventName: "suspend", cb: () => any): this
	on(eventName: "set_title", cb: (title: string) => any): this
	on(eventName: "set_icon", cb: (icon: string) => any): this
	on(eventName: "option_set", cb: (name: string, value: any) => any): this
	on(eventName: "update_fg", cb: (fg: number) => any): this
	on(eventName: "update_bg", cb: (bg: number) => any): this
	on(eventName: "update_sp", cb: (sp: number) => any): this
	on(eventName: "resize", cb: (width: number, height: number) => any): this
	on(eventName: "clear", cb: () => any): this
	on(eventName: "eol_clear", cb: () => any): this
	on(eventName: "cursor_goto", cb: (row: number, col: number) => any): this
	on(eventName: "highlight_set", cb: (attrs: Record<string, any>) => any): this
	on(eventName: "put", cb: (str: string) => any): this
	on(eventName: "set_scroll_region", cb: (top: number, bot: number, left: number, right: number) => any): this
	on(eventName: "scroll", cb: (count: number) => any): this
	on(eventName: "default_colors_set", cb: (rgb_fg: number, rgb_bg: number, rgb_sp: number, cterm_fg: number, cterm_bg: number) => any): this
	on(eventName: "hl_attr_define", cb: (id: number, rgb_attrs: Record<string, any>, cterm_attrs: Record<string, any>, info: any[]) => any): this
	on(eventName: "hl_group_set", cb: (name: string, id: number) => any): this
	on(eventName: "grid_resize", cb: (grid: number, width: number, height: number) => any): this
	on(eventName: "grid_clear", cb: (grid: number) => any): this
	on(eventName: "grid_cursor_goto", cb: (grid: number, row: number, col: number) => any): this
	on(eventName: "grid_line", cb: (grid: number, row: number, col_start: number, data: any[]) => any): this
	on(eventName: "grid_scroll", cb: (grid: number, top: number, bot: number, left: number, right: number, rows: number, cols: number) => any): this
	on(eventName: "grid_destroy", cb: (grid: number) => any): this
	on(eventName: "win_pos", cb: (grid: number, win: import('neovim').Window, startrow: number, startcol: number, width: number, height: number) => any): this
	on(eventName: "win_float_pos", cb: (grid: number, win: import('neovim').Window, anchor: string, anchor_grid: number, anchor_row: number, anchor_col: number, focusable: boolean) => any): this
	on(eventName: "win_external_pos", cb: (grid: number, win: import('neovim').Window) => any): this
	on(eventName: "win_hide", cb: (grid: number) => any): this
	on(eventName: "win_close", cb: (grid: number) => any): this
	on(eventName: "msg_set_pos", cb: (grid: number, row: number, scrolled: boolean, sep_char: string) => any): this
	on(eventName: "popupmenu_show", cb: (items: any[], selected: number, row: number, col: number, grid: number) => any): this
	on(eventName: "popupmenu_hide", cb: () => any): this
	on(eventName: "popupmenu_select", cb: (selected: number) => any): this
	on(eventName: "tabline_update", cb: (current: import('neovim').Tabpage, tabs: any[]) => any): this
	on(eventName: "cmdline_show", cb: (content: any[], pos: number, firstc: string, prompt: string, indent: number, level: number) => any): this
	on(eventName: "cmdline_pos", cb: (pos: number, level: number) => any): this
	on(eventName: "cmdline_special_char", cb: (c: string, shift: boolean, level: number) => any): this
	on(eventName: "cmdline_hide", cb: (level: number) => any): this
	on(eventName: "cmdline_block_show", cb: (lines: any[]) => any): this
	on(eventName: "cmdline_block_append", cb: (lines: any[]) => any): this
	on(eventName: "cmdline_block_hide", cb: () => any): this
	on(eventName: "wildmenu_show", cb: (items: any[]) => any): this
	on(eventName: "wildmenu_select", cb: (selected: number) => any): this
	on(eventName: "wildmenu_hide", cb: () => any): this
	on(eventName: "msg_show", cb: (kind: string, content: any[], replace_last: boolean) => any): this
	on(eventName: "msg_clear", cb: () => any): this
	on(eventName: "msg_showcmd", cb: (content: any[]) => any): this
	on(eventName: "msg_showmode", cb: (content: any[]) => any): this
	on(eventName: "msg_ruler", cb: (content: any[]) => any): this
	on(eventName: "msg_history_show", cb: (entries: any[]) => any): this
	nvim_buf_line_count(buffer: import('neovim').Buffer): Promise<number>;
	buffer_get_line(buffer: import('neovim').Buffer, index: number): Promise<string>;
	nvim_buf_attach(buffer: import('neovim').Buffer, send_buffer: boolean, opts: Record<string, any>): Promise<boolean>;
	nvim_buf_detach(buffer: import('neovim').Buffer): Promise<boolean>;
	buffer_set_line(buffer: import('neovim').Buffer, index: number, line: string): Promise<void>;
	buffer_del_line(buffer: import('neovim').Buffer, index: number): Promise<void>;
	buffer_get_line_slice(buffer: import('neovim').Buffer, start: number, end: number, include_start: boolean, include_end: boolean): Promise<string[]>;
	nvim_buf_get_lines(buffer: import('neovim').Buffer, start: number, end: number, strict_indexing: boolean): Promise<string[]>;
	buffer_set_line_slice(buffer: import('neovim').Buffer, start: number, end: number, include_start: boolean, include_end: boolean, replacement: string[]): Promise<void>;
	nvim_buf_set_lines(buffer: import('neovim').Buffer, start: number, end: number, strict_indexing: boolean, replacement: string[]): Promise<void>;
	nvim_buf_get_offset(buffer: import('neovim').Buffer, index: number): Promise<number>;
	nvim_buf_get_var(buffer: import('neovim').Buffer, name: string): Promise<any>;
	nvim_buf_get_changedtick(buffer: import('neovim').Buffer): Promise<number>;
	nvim_buf_get_keymap(buffer: import('neovim').Buffer, mode: string): Promise<Record<string, any>[]>;
	nvim_buf_set_keymap(buffer: import('neovim').Buffer, mode: string, lhs: string, rhs: string, opts: Record<string, any>): Promise<void>;
	nvim_buf_del_keymap(buffer: import('neovim').Buffer, mode: string, lhs: string): Promise<void>;
	nvim_buf_get_commands(buffer: import('neovim').Buffer, opts: Record<string, any>): Promise<Record<string, any>>;
	nvim_buf_set_var(buffer: import('neovim').Buffer, name: string, value: any): Promise<void>;
	nvim_buf_del_var(buffer: import('neovim').Buffer, name: string): Promise<void>;
	buffer_set_var(buffer: import('neovim').Buffer, name: string, value: any): Promise<any>;
	buffer_del_var(buffer: import('neovim').Buffer, name: string): Promise<any>;
	nvim_buf_get_option(buffer: import('neovim').Buffer, name: string): Promise<any>;
	nvim_buf_set_option(buffer: import('neovim').Buffer, name: string, value: any): Promise<void>;
	nvim_buf_get_number(buffer: import('neovim').Buffer): Promise<number>;
	nvim_buf_get_name(buffer: import('neovim').Buffer): Promise<string>;
	nvim_buf_set_name(buffer: import('neovim').Buffer, name: string): Promise<void>;
	nvim_buf_is_loaded(buffer: import('neovim').Buffer): Promise<boolean>;
	nvim_buf_is_valid(buffer: import('neovim').Buffer): Promise<boolean>;
	buffer_insert(buffer: import('neovim').Buffer, lnum: number, lines: string[]): Promise<void>;
	nvim_buf_get_mark(buffer: import('neovim').Buffer, name: string): Promise<number[]>;
	nvim_buf_add_highlight(buffer: import('neovim').Buffer, ns_id: number, hl_group: string, line: number, col_start: number, col_end: number): Promise<number>;
	nvim_buf_clear_namespace(buffer: import('neovim').Buffer, ns_id: number, line_start: number, line_end: number): Promise<void>;
	nvim_buf_clear_highlight(buffer: import('neovim').Buffer, ns_id: number, line_start: number, line_end: number): Promise<void>;
	nvim_buf_set_virtual_text(buffer: import('neovim').Buffer, ns_id: number, line: number, chunks: any[], opts: Record<string, any>): Promise<number>;
	nvim_tabpage_list_wins(tabpage: import('neovim').Tabpage): Promise<import('neovim').Window[]>;
	nvim_tabpage_get_var(tabpage: import('neovim').Tabpage, name: string): Promise<any>;
	nvim_tabpage_set_var(tabpage: import('neovim').Tabpage, name: string, value: any): Promise<void>;
	nvim_tabpage_del_var(tabpage: import('neovim').Tabpage, name: string): Promise<void>;
	tabpage_set_var(tabpage: import('neovim').Tabpage, name: string, value: any): Promise<any>;
	tabpage_del_var(tabpage: import('neovim').Tabpage, name: string): Promise<any>;
	nvim_tabpage_get_win(tabpage: import('neovim').Tabpage): Promise<import('neovim').Window>;
	nvim_tabpage_get_number(tabpage: import('neovim').Tabpage): Promise<number>;
	nvim_tabpage_is_valid(tabpage: import('neovim').Tabpage): Promise<boolean>;
	nvim_ui_attach(width: number, height: number, options: Record<string, any>): Promise<void>;
	ui_attach(width: number, height: number, enable_rgb: boolean): Promise<void>;
	nvim_ui_detach(): Promise<void>;
	nvim_ui_try_resize(width: number, height: number): Promise<void>;
	nvim_ui_set_option(name: string, value: any): Promise<void>;
	nvim_ui_try_resize_grid(grid: number, width: number, height: number): Promise<void>;
	nvim_ui_pum_set_height(height: number): Promise<void>;
	nvim_command(command: string): Promise<void>;
	nvim_get_hl_by_name(name: string, rgb: boolean): Promise<Record<string, any>>;
	nvim_get_hl_by_id(hl_id: number, rgb: boolean): Promise<Record<string, any>>;
	nvim_feedkeys(keys: string, mode: string, escape_csi: boolean): Promise<void>;
	nvim_input(keys: string): Promise<number>;
	nvim_input_mouse(button: string, action: string, modifier: string, grid: number, row: number, col: number): Promise<void>;
	nvim_replace_termcodes(str: string, from_part: boolean, do_lt: boolean, special: boolean): Promise<string>;
	nvim_command_output(command: string): Promise<string>;
	nvim_eval(expr: string): Promise<any>;
	nvim_execute_lua(code: string, args: any[]): Promise<any>;
	nvim_call_function(fn: string, args: any[]): Promise<any>;
	nvim_call_dict_function(dict: any, fn: string, args: any[]): Promise<any>;
	nvim_strwidth(text: string): Promise<number>;
	nvim_list_runtime_paths(): Promise<string[]>;
	nvim_set_current_dir(dir: string): Promise<void>;
	nvim_get_current_line(): Promise<string>;
	nvim_set_current_line(line: string): Promise<void>;
	nvim_del_current_line(): Promise<void>;
	nvim_get_var(name: string): Promise<any>;
	nvim_set_var(name: string, value: any): Promise<void>;
	nvim_del_var(name: string): Promise<void>;
	vim_set_var(name: string, value: any): Promise<any>;
	vim_del_var(name: string): Promise<any>;
	nvim_get_vvar(name: string): Promise<any>;
	nvim_set_vvar(name: string, value: any): Promise<void>;
	nvim_get_option(name: string): Promise<any>;
	nvim_set_option(name: string, value: any): Promise<void>;
	nvim_out_write(str: string): Promise<void>;
	nvim_err_write(str: string): Promise<void>;
	nvim_err_writeln(str: string): Promise<void>;
	nvim_list_bufs(): Promise<import('neovim').Buffer[]>;
	nvim_get_current_buf(): Promise<import('neovim').Buffer>;
	nvim_set_current_buf(buffer: import('neovim').Buffer): Promise<void>;
	nvim_list_wins(): Promise<import('neovim').Window[]>;
	nvim_get_current_win(): Promise<import('neovim').Window>;
	nvim_set_current_win(window: import('neovim').Window): Promise<void>;
	nvim_create_buf(listed: boolean, scratch: boolean): Promise<import('neovim').Buffer>;
	nvim_open_win(buffer: import('neovim').Buffer, enter: boolean, config: Record<string, any>): Promise<import('neovim').Window>;
	nvim_list_tabpages(): Promise<import('neovim').Tabpage[]>;
	nvim_get_current_tabpage(): Promise<import('neovim').Tabpage>;
	nvim_set_current_tabpage(tabpage: import('neovim').Tabpage): Promise<void>;
	nvim_create_namespace(name: string): Promise<number>;
	nvim_get_namespaces(): Promise<Record<string, any>>;
	nvim_paste(data: string, crlf: boolean, phase: number): Promise<boolean>;
	nvim_put(lines: string[], type: string, after: boolean, follow: boolean): Promise<void>;
	nvim_subscribe(event: string): Promise<void>;
	nvim_unsubscribe(event: string): Promise<void>;
	nvim_get_color_by_name(name: string): Promise<number>;
	nvim_get_color_map(): Promise<Record<string, any>>;
	nvim_get_context(opts: Record<string, any>): Promise<Record<string, any>>;
	nvim_load_context(dict: Record<string, any>): Promise<any>;
	nvim_get_mode(): Promise<Record<string, any>>;
	nvim_get_keymap(mode: string): Promise<Record<string, any>[]>;
	nvim_set_keymap(mode: string, lhs: string, rhs: string, opts: Record<string, any>): Promise<void>;
	nvim_del_keymap(mode: string, lhs: string): Promise<void>;
	nvim_get_commands(opts: Record<string, any>): Promise<Record<string, any>>;
	nvim_get_api_info(): Promise<any[]>;
	nvim_set_client_info(name: string, version: Record<string, any>, type: string, methods: Record<string, any>, attributes: Record<string, any>): Promise<void>;
	nvim_get_chan_info(chan: number): Promise<Record<string, any>>;
	nvim_list_chans(): Promise<any[]>;
	nvim_call_atomic(calls: any[]): Promise<any[]>;
	nvim_parse_expression(expr: string, flags: string, highlight: boolean): Promise<Record<string, any>>;
	nvim_list_uis(): Promise<any[]>;
	nvim_get_proc_children(pid: number): Promise<any[]>;
	nvim_get_proc(pid: number): Promise<any>;
	nvim_select_popupmenu_item(item: number, insert: boolean, finish: boolean, opts: Record<string, any>): Promise<void>;
	nvim_win_get_buf(window: import('neovim').Window): Promise<import('neovim').Buffer>;
	nvim_win_set_buf(window: import('neovim').Window, buffer: import('neovim').Buffer): Promise<void>;
	nvim_win_get_cursor(window: import('neovim').Window): Promise<number[]>;
	nvim_win_set_cursor(window: import('neovim').Window, pos: number[]): Promise<void>;
	nvim_win_get_height(window: import('neovim').Window): Promise<number>;
	nvim_win_set_height(window: import('neovim').Window, height: number): Promise<void>;
	nvim_win_get_width(window: import('neovim').Window): Promise<number>;
	nvim_win_set_width(window: import('neovim').Window, width: number): Promise<void>;
	nvim_win_get_var(window: import('neovim').Window, name: string): Promise<any>;
	nvim_win_set_var(window: import('neovim').Window, name: string, value: any): Promise<void>;
	nvim_win_del_var(window: import('neovim').Window, name: string): Promise<void>;
	window_set_var(window: import('neovim').Window, name: string, value: any): Promise<any>;
	window_del_var(window: import('neovim').Window, name: string): Promise<any>;
	nvim_win_get_option(window: import('neovim').Window, name: string): Promise<any>;
	nvim_win_set_option(window: import('neovim').Window, name: string, value: any): Promise<void>;
	nvim_win_get_position(window: import('neovim').Window): Promise<number[]>;
	nvim_win_get_tabpage(window: import('neovim').Window): Promise<import('neovim').Tabpage>;
	nvim_win_get_number(window: import('neovim').Window): Promise<number>;
	nvim_win_is_valid(window: import('neovim').Window): Promise<boolean>;
	nvim_win_set_config(window: import('neovim').Window, config: Record<string, any>): Promise<void>;
	nvim_win_get_config(window: import('neovim').Window): Promise<Record<string, any>>;
	nvim_win_close(window: import('neovim').Window, force: boolean): Promise<void>;
	buffer_line_count(buffer: import('neovim').Buffer): Promise<number>;
	buffer_get_lines(buffer: import('neovim').Buffer, start: number, end: number, strict_indexing: boolean): Promise<string[]>;
	buffer_set_lines(buffer: import('neovim').Buffer, start: number, end: number, strict_indexing: boolean, replacement: string[]): Promise<void>;
	buffer_get_var(buffer: import('neovim').Buffer, name: string): Promise<any>;
	buffer_get_option(buffer: import('neovim').Buffer, name: string): Promise<any>;
	buffer_set_option(buffer: import('neovim').Buffer, name: string, value: any): Promise<void>;
	buffer_get_number(buffer: import('neovim').Buffer): Promise<number>;
	buffer_get_name(buffer: import('neovim').Buffer): Promise<string>;
	buffer_set_name(buffer: import('neovim').Buffer, name: string): Promise<void>;
	buffer_is_valid(buffer: import('neovim').Buffer): Promise<boolean>;
	buffer_get_mark(buffer: import('neovim').Buffer, name: string): Promise<number[]>;
	buffer_add_highlight(buffer: import('neovim').Buffer, ns_id: number, hl_group: string, line: number, col_start: number, col_end: number): Promise<number>;
	buffer_clear_highlight(buffer: import('neovim').Buffer, ns_id: number, line_start: number, line_end: number): Promise<void>;
	tabpage_get_windows(tabpage: import('neovim').Tabpage): Promise<import('neovim').Window[]>;
	tabpage_get_var(tabpage: import('neovim').Tabpage, name: string): Promise<any>;
	tabpage_get_window(tabpage: import('neovim').Tabpage): Promise<import('neovim').Window>;
	tabpage_is_valid(tabpage: import('neovim').Tabpage): Promise<boolean>;
	ui_detach(): Promise<void>;
	ui_try_resize(width: number, height: number): Promise<any>;
	vim_command(command: string): Promise<void>;
	vim_feedkeys(keys: string, mode: string, escape_csi: boolean): Promise<void>;
	vim_input(keys: string): Promise<number>;
	vim_replace_termcodes(str: string, from_part: boolean, do_lt: boolean, special: boolean): Promise<string>;
	vim_command_output(command: string): Promise<string>;
	vim_eval(expr: string): Promise<any>;
	vim_call_function(fn: string, args: any[]): Promise<any>;
	vim_strwidth(text: string): Promise<number>;
	vim_list_runtime_paths(): Promise<string[]>;
	vim_change_directory(dir: string): Promise<void>;
	vim_get_current_line(): Promise<string>;
	vim_set_current_line(line: string): Promise<void>;
	vim_del_current_line(): Promise<void>;
	vim_get_var(name: string): Promise<any>;
	vim_get_vvar(name: string): Promise<any>;
	vim_get_option(name: string): Promise<any>;
	vim_set_option(name: string, value: any): Promise<void>;
	vim_out_write(str: string): Promise<void>;
	vim_err_write(str: string): Promise<void>;
	vim_report_error(str: string): Promise<void>;
	vim_get_buffers(): Promise<import('neovim').Buffer[]>;
	vim_get_current_buffer(): Promise<import('neovim').Buffer>;
	vim_set_current_buffer(buffer: import('neovim').Buffer): Promise<void>;
	vim_get_windows(): Promise<import('neovim').Window[]>;
	vim_get_current_window(): Promise<import('neovim').Window>;
	vim_set_current_window(window: import('neovim').Window): Promise<void>;
	vim_get_tabpages(): Promise<import('neovim').Tabpage[]>;
	vim_get_current_tabpage(): Promise<import('neovim').Tabpage>;
	vim_set_current_tabpage(tabpage: import('neovim').Tabpage): Promise<void>;
	vim_subscribe(event: string): Promise<void>;
	vim_unsubscribe(event: string): Promise<void>;
	vim_name_to_color(name: string): Promise<number>;
	vim_get_color_map(): Promise<Record<string, any>>;
	vim_get_api_info(): Promise<any[]>;
	window_get_buffer(window: import('neovim').Window): Promise<import('neovim').Buffer>;
	window_get_cursor(window: import('neovim').Window): Promise<number[]>;
	window_set_cursor(window: import('neovim').Window, pos: number[]): Promise<void>;
	window_get_height(window: import('neovim').Window): Promise<number>;
	window_set_height(window: import('neovim').Window, height: number): Promise<void>;
	window_get_width(window: import('neovim').Window): Promise<number>;
	window_set_width(window: import('neovim').Window, width: number): Promise<void>;
	window_get_var(window: import('neovim').Window, name: string): Promise<any>;
	window_get_option(window: import('neovim').Window, name: string): Promise<any>;
	window_set_option(window: import('neovim').Window, name: string, value: any): Promise<void>;
	window_get_position(window: import('neovim').Window): Promise<number[]>;
	window_get_tabpage(window: import('neovim').Window): Promise<import('neovim').Tabpage>;
	window_is_valid(window: import('neovim').Window): Promise<boolean>;
}