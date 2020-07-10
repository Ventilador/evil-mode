import { EventEmitter } from 'events';        
export interface Vim extends EventEmitter{
    on(eventName: "mode_info_set", cb: (args: [boolean/*enabled*/, any[]/*cursor_styles*/]) => any): this
	on(eventName: "update_menu", cb: () => any): this
	on(eventName: "busy_start", cb: () => any): this
	on(eventName: "busy_stop", cb: () => any): this
	on(eventName: "mouse_on", cb: () => any): this
	on(eventName: "mouse_off", cb: () => any): this
	on(eventName: "mode_change", cb: (args: [string/*mode*/, number/*mode_idx*/]) => any): this
	on(eventName: "bell", cb: () => any): this
	on(eventName: "visual_bell", cb: () => any): this
	on(eventName: "flush", cb: () => any): this
	on(eventName: "suspend", cb: () => any): this
	on(eventName: "set_title", cb: (args: [string/*title*/]) => any): this
	on(eventName: "set_icon", cb: (args: [string/*icon*/]) => any): this
	on(eventName: "option_set", cb: (args: [string/*name*/, any/*value*/]) => any): this
	on(eventName: "update_fg", cb: (args: [number/*fg*/]) => any): this
	on(eventName: "update_bg", cb: (args: [number/*bg*/]) => any): this
	on(eventName: "update_sp", cb: (args: [number/*sp*/]) => any): this
	on(eventName: "resize", cb: (args: [number/*width*/, number/*height*/]) => any): this
	on(eventName: "clear", cb: () => any): this
	on(eventName: "eol_clear", cb: () => any): this
	on(eventName: "cursor_goto", cb: (args: [number/*row*/, number/*col*/]) => any): this
	on(eventName: "highlight_set", cb: (args: [Record<string, any>/*attrs*/]) => any): this
	on(eventName: "put", cb: (args: [string/*str*/]) => any): this
	on(eventName: "set_scroll_region", cb: (args: [number/*top*/, number/*bot*/, number/*left*/, number/*right*/]) => any): this
	on(eventName: "scroll", cb: (args: [number/*count*/]) => any): this
	on(eventName: "default_colors_set", cb: (args: [number/*rgb_fg*/, number/*rgb_bg*/, number/*rgb_sp*/, number/*cterm_fg*/, number/*cterm_bg*/]) => any): this
	on(eventName: "hl_attr_define", cb: (args: [number/*id*/, Record<string, any>/*rgb_attrs*/, Record<string, any>/*cterm_attrs*/, any[]/*info*/]) => any): this
	on(eventName: "hl_group_set", cb: (args: [string/*name*/, number/*id*/]) => any): this
	on(eventName: "grid_resize", cb: (args: [number/*grid*/, number/*width*/, number/*height*/]) => any): this
	on(eventName: "grid_clear", cb: (args: [number/*grid*/]) => any): this
	on(eventName: "grid_cursor_goto", cb: (args: [number/*grid*/, number/*row*/, number/*col*/]) => any): this
	on(eventName: "grid_line", cb: (args: [number/*grid*/, number/*row*/, number/*col_start*/, any[]/*data*/]) => any): this
	on(eventName: "grid_scroll", cb: (args: [number/*grid*/, number/*top*/, number/*bot*/, number/*left*/, number/*right*/, number/*rows*/, number/*cols*/]) => any): this
	on(eventName: "grid_destroy", cb: (args: [number/*grid*/]) => any): this
	on(eventName: "win_pos", cb: (args: [number/*grid*/, import('../utils/mappers').Win/*win*/, number/*startrow*/, number/*startcol*/, number/*width*/, number/*height*/]) => any): this
	on(eventName: "win_float_pos", cb: (args: [number/*grid*/, import('../utils/mappers').Win/*win*/, string/*anchor*/, number/*anchor_grid*/, number/*anchor_row*/, number/*anchor_col*/, boolean/*focusable*/]) => any): this
	on(eventName: "win_external_pos", cb: (args: [number/*grid*/, import('../utils/mappers').Win/*win*/]) => any): this
	on(eventName: "win_hide", cb: (args: [number/*grid*/]) => any): this
	on(eventName: "win_close", cb: (args: [number/*grid*/]) => any): this
	on(eventName: "msg_set_pos", cb: (args: [number/*grid*/, number/*row*/, boolean/*scrolled*/, string/*sep_char*/]) => any): this
	on(eventName: "popupmenu_show", cb: (args: [any[]/*items*/, number/*selected*/, number/*row*/, number/*col*/, number/*grid*/]) => any): this
	on(eventName: "popupmenu_hide", cb: () => any): this
	on(eventName: "popupmenu_select", cb: (args: [number/*selected*/]) => any): this
	on(eventName: "tabline_update", cb: (args: [import('../utils/mappers').Tab/*current*/, any[]/*tabs*/]) => any): this
	on(eventName: "cmdline_show", cb: (args: [any[]/*content*/, number/*pos*/, string/*firstc*/, string/*prompt*/, number/*indent*/, number/*level*/]) => any): this
	on(eventName: "cmdline_pos", cb: (args: [number/*pos*/, number/*level*/]) => any): this
	on(eventName: "cmdline_special_char", cb: (args: [string/*c*/, boolean/*shift*/, number/*level*/]) => any): this
	on(eventName: "cmdline_hide", cb: (args: [number/*level*/]) => any): this
	on(eventName: "cmdline_block_show", cb: (args: [any[]/*lines*/]) => any): this
	on(eventName: "cmdline_block_append", cb: (args: [any[]/*lines*/]) => any): this
	on(eventName: "cmdline_block_hide", cb: () => any): this
	on(eventName: "wildmenu_show", cb: (args: [any[]/*items*/]) => any): this
	on(eventName: "wildmenu_select", cb: (args: [number/*selected*/]) => any): this
	on(eventName: "wildmenu_hide", cb: () => any): this
	on(eventName: "msg_show", cb: (args: [string/*kind*/, any[]/*content*/, boolean/*replace_last*/]) => any): this
	on(eventName: "msg_clear", cb: () => any): this
	on(eventName: "msg_showcmd", cb: (args: [any[]/*content*/]) => any): this
	on(eventName: "msg_showmode", cb: (args: [any[]/*content*/]) => any): this
	on(eventName: "msg_ruler", cb: (args: [any[]/*content*/]) => any): this
	on(eventName: "msg_history_show", cb: (args: [any[]/*entries*/]) => any): this
    nvim_buf_line_count(buffer: import('../utils/mappers').Buf): Promise<number>;
	buffer_get_line(buffer: import('../utils/mappers').Buf, index: number): Promise<string>;
	nvim_buf_attach(buffer: import('../utils/mappers').Buf, send_buffer: boolean, opts: Record<string, any>): Promise<boolean>;
	nvim_buf_detach(buffer: import('../utils/mappers').Buf): Promise<boolean>;
	buffer_set_line(buffer: import('../utils/mappers').Buf, index: number, line: string): Promise<void>;
	buffer_del_line(buffer: import('../utils/mappers').Buf, index: number): Promise<void>;
	buffer_get_line_slice(buffer: import('../utils/mappers').Buf, start: number, end: number, include_start: boolean, include_end: boolean): Promise<string[]>;
	nvim_buf_get_lines(buffer: import('../utils/mappers').Buf, start: number, end: number, strict_indexing: boolean): Promise<string[]>;
	buffer_set_line_slice(buffer: import('../utils/mappers').Buf, start: number, end: number, include_start: boolean, include_end: boolean, replacement: string[]): Promise<void>;
	nvim_buf_set_lines(buffer: import('../utils/mappers').Buf, start: number, end: number, strict_indexing: boolean, replacement: string[]): Promise<void>;
	nvim_buf_get_offset(buffer: import('../utils/mappers').Buf, index: number): Promise<number>;
	nvim_buf_get_var(buffer: import('../utils/mappers').Buf, name: string): Promise<any>;
	nvim_buf_get_changedtick(buffer: import('../utils/mappers').Buf): Promise<number>;
	nvim_buf_get_keymap(buffer: import('../utils/mappers').Buf, mode: string): Promise<Record<string, any>[]>;
	nvim_buf_set_keymap(buffer: import('../utils/mappers').Buf, mode: string, lhs: string, rhs: string, opts: Record<string, any>): Promise<void>;
	nvim_buf_del_keymap(buffer: import('../utils/mappers').Buf, mode: string, lhs: string): Promise<void>;
	nvim_buf_get_commands(buffer: import('../utils/mappers').Buf, opts: Record<string, any>): Promise<Record<string, any>>;
	nvim_buf_set_var(buffer: import('../utils/mappers').Buf, name: string, value: any): Promise<void>;
	nvim_buf_del_var(buffer: import('../utils/mappers').Buf, name: string): Promise<void>;
	buffer_set_var(buffer: import('../utils/mappers').Buf, name: string, value: any): Promise<any>;
	buffer_del_var(buffer: import('../utils/mappers').Buf, name: string): Promise<any>;
	nvim_buf_get_option(buffer: import('../utils/mappers').Buf, name: string): Promise<any>;
	nvim_buf_set_option(buffer: import('../utils/mappers').Buf, name: string, value: any): Promise<void>;
	nvim_buf_get_number(buffer: import('../utils/mappers').Buf): Promise<number>;
	nvim_buf_get_name(buffer: import('../utils/mappers').Buf): Promise<string>;
	nvim_buf_set_name(buffer: import('../utils/mappers').Buf, name: string): Promise<void>;
	nvim_buf_is_loaded(buffer: import('../utils/mappers').Buf): Promise<boolean>;
	nvim_buf_is_valid(buffer: import('../utils/mappers').Buf): Promise<boolean>;
	buffer_insert(buffer: import('../utils/mappers').Buf, lnum: number, lines: string[]): Promise<void>;
	nvim_buf_get_mark(buffer: import('../utils/mappers').Buf, name: string): Promise<number[]>;
	nvim_buf_add_highlight(buffer: import('../utils/mappers').Buf, ns_id: number, hl_group: string, line: number, col_start: number, col_end: number): Promise<number>;
	nvim_buf_clear_namespace(buffer: import('../utils/mappers').Buf, ns_id: number, line_start: number, line_end: number): Promise<void>;
	nvim_buf_clear_highlight(buffer: import('../utils/mappers').Buf, ns_id: number, line_start: number, line_end: number): Promise<void>;
	nvim_buf_set_virtual_text(buffer: import('../utils/mappers').Buf, ns_id: number, line: number, chunks: any[], opts: Record<string, any>): Promise<number>;
	nvim_tabpage_list_wins(tabpage: import('../utils/mappers').Tab): Promise<import('../utils/mappers').Win[]>;
	nvim_tabpage_get_var(tabpage: import('../utils/mappers').Tab, name: string): Promise<any>;
	nvim_tabpage_set_var(tabpage: import('../utils/mappers').Tab, name: string, value: any): Promise<void>;
	nvim_tabpage_del_var(tabpage: import('../utils/mappers').Tab, name: string): Promise<void>;
	tabpage_set_var(tabpage: import('../utils/mappers').Tab, name: string, value: any): Promise<any>;
	tabpage_del_var(tabpage: import('../utils/mappers').Tab, name: string): Promise<any>;
	nvim_tabpage_get_win(tabpage: import('../utils/mappers').Tab): Promise<import('../utils/mappers').Win>;
	nvim_tabpage_get_number(tabpage: import('../utils/mappers').Tab): Promise<number>;
	nvim_tabpage_is_valid(tabpage: import('../utils/mappers').Tab): Promise<boolean>;
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
	nvim_list_bufs(): Promise<import('../utils/mappers').Buf[]>;
	nvim_get_current_buf(): Promise<import('../utils/mappers').Buf>;
	nvim_set_current_buf(buffer: import('../utils/mappers').Buf): Promise<void>;
	nvim_list_wins(): Promise<import('../utils/mappers').Win[]>;
	nvim_get_current_win(): Promise<import('../utils/mappers').Win>;
	nvim_set_current_win(window: import('../utils/mappers').Win): Promise<void>;
	nvim_create_buf(listed: boolean, scratch: boolean): Promise<import('../utils/mappers').Buf>;
	nvim_open_win(buffer: import('../utils/mappers').Buf, enter: boolean, config: Record<string, any>): Promise<import('../utils/mappers').Win>;
	nvim_list_tabpages(): Promise<import('../utils/mappers').Tab[]>;
	nvim_get_current_tabpage(): Promise<import('../utils/mappers').Tab>;
	nvim_set_current_tabpage(tabpage: import('../utils/mappers').Tab): Promise<void>;
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
	nvim_win_get_buf(window: import('../utils/mappers').Win): Promise<import('../utils/mappers').Buf>;
	nvim_win_set_buf(window: import('../utils/mappers').Win, buffer: import('../utils/mappers').Buf): Promise<void>;
	nvim_win_get_cursor(window: import('../utils/mappers').Win): Promise<number[]>;
	nvim_win_set_cursor(window: import('../utils/mappers').Win, pos: number[]): Promise<void>;
	nvim_win_get_height(window: import('../utils/mappers').Win): Promise<number>;
	nvim_win_set_height(window: import('../utils/mappers').Win, height: number): Promise<void>;
	nvim_win_get_width(window: import('../utils/mappers').Win): Promise<number>;
	nvim_win_set_width(window: import('../utils/mappers').Win, width: number): Promise<void>;
	nvim_win_get_var(window: import('../utils/mappers').Win, name: string): Promise<any>;
	nvim_win_set_var(window: import('../utils/mappers').Win, name: string, value: any): Promise<void>;
	nvim_win_del_var(window: import('../utils/mappers').Win, name: string): Promise<void>;
	window_set_var(window: import('../utils/mappers').Win, name: string, value: any): Promise<any>;
	window_del_var(window: import('../utils/mappers').Win, name: string): Promise<any>;
	nvim_win_get_option(window: import('../utils/mappers').Win, name: string): Promise<any>;
	nvim_win_set_option(window: import('../utils/mappers').Win, name: string, value: any): Promise<void>;
	nvim_win_get_position(window: import('../utils/mappers').Win): Promise<number[]>;
	nvim_win_get_tabpage(window: import('../utils/mappers').Win): Promise<import('../utils/mappers').Tab>;
	nvim_win_get_number(window: import('../utils/mappers').Win): Promise<number>;
	nvim_win_is_valid(window: import('../utils/mappers').Win): Promise<boolean>;
	nvim_win_set_config(window: import('../utils/mappers').Win, config: Record<string, any>): Promise<void>;
	nvim_win_get_config(window: import('../utils/mappers').Win): Promise<Record<string, any>>;
	nvim_win_close(window: import('../utils/mappers').Win, force: boolean): Promise<void>;
	buffer_line_count(buffer: import('../utils/mappers').Buf): Promise<number>;
	buffer_get_lines(buffer: import('../utils/mappers').Buf, start: number, end: number, strict_indexing: boolean): Promise<string[]>;
	buffer_set_lines(buffer: import('../utils/mappers').Buf, start: number, end: number, strict_indexing: boolean, replacement: string[]): Promise<void>;
	buffer_get_var(buffer: import('../utils/mappers').Buf, name: string): Promise<any>;
	buffer_get_option(buffer: import('../utils/mappers').Buf, name: string): Promise<any>;
	buffer_set_option(buffer: import('../utils/mappers').Buf, name: string, value: any): Promise<void>;
	buffer_get_number(buffer: import('../utils/mappers').Buf): Promise<number>;
	buffer_get_name(buffer: import('../utils/mappers').Buf): Promise<string>;
	buffer_set_name(buffer: import('../utils/mappers').Buf, name: string): Promise<void>;
	buffer_is_valid(buffer: import('../utils/mappers').Buf): Promise<boolean>;
	buffer_get_mark(buffer: import('../utils/mappers').Buf, name: string): Promise<number[]>;
	buffer_add_highlight(buffer: import('../utils/mappers').Buf, ns_id: number, hl_group: string, line: number, col_start: number, col_end: number): Promise<number>;
	buffer_clear_highlight(buffer: import('../utils/mappers').Buf, ns_id: number, line_start: number, line_end: number): Promise<void>;
	tabpage_get_windows(tabpage: import('../utils/mappers').Tab): Promise<import('../utils/mappers').Win[]>;
	tabpage_get_var(tabpage: import('../utils/mappers').Tab, name: string): Promise<any>;
	tabpage_get_window(tabpage: import('../utils/mappers').Tab): Promise<import('../utils/mappers').Win>;
	tabpage_is_valid(tabpage: import('../utils/mappers').Tab): Promise<boolean>;
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
	vim_get_buffers(): Promise<import('../utils/mappers').Buf[]>;
	vim_get_current_buffer(): Promise<import('../utils/mappers').Buf>;
	vim_set_current_buffer(buffer: import('../utils/mappers').Buf): Promise<void>;
	vim_get_windows(): Promise<import('../utils/mappers').Win[]>;
	vim_get_current_window(): Promise<import('../utils/mappers').Win>;
	vim_set_current_window(window: import('../utils/mappers').Win): Promise<void>;
	vim_get_tabpages(): Promise<import('../utils/mappers').Tab[]>;
	vim_get_current_tabpage(): Promise<import('../utils/mappers').Tab>;
	vim_set_current_tabpage(tabpage: import('../utils/mappers').Tab): Promise<void>;
	vim_subscribe(event: string): Promise<void>;
	vim_unsubscribe(event: string): Promise<void>;
	vim_name_to_color(name: string): Promise<number>;
	vim_get_color_map(): Promise<Record<string, any>>;
	vim_get_api_info(): Promise<any[]>;
	window_get_buffer(window: import('../utils/mappers').Win): Promise<import('../utils/mappers').Buf>;
	window_get_cursor(window: import('../utils/mappers').Win): Promise<number[]>;
	window_set_cursor(window: import('../utils/mappers').Win, pos: number[]): Promise<void>;
	window_get_height(window: import('../utils/mappers').Win): Promise<number>;
	window_set_height(window: import('../utils/mappers').Win, height: number): Promise<void>;
	window_get_width(window: import('../utils/mappers').Win): Promise<number>;
	window_set_width(window: import('../utils/mappers').Win, width: number): Promise<void>;
	window_get_var(window: import('../utils/mappers').Win, name: string): Promise<any>;
	window_get_option(window: import('../utils/mappers').Win, name: string): Promise<any>;
	window_set_option(window: import('../utils/mappers').Win, name: string, value: any): Promise<void>;
	window_get_position(window: import('../utils/mappers').Win): Promise<number[]>;
	window_get_tabpage(window: import('../utils/mappers').Win): Promise<import('../utils/mappers').Tab>;
	window_is_valid(window: import('../utils/mappers').Win): Promise<boolean>;
    quit(): Promise<void>;
    raw(value: string | Uint8Array): void;
}