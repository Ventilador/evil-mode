import { Vim } from "./api";
import { EventEmitter } from "events";
import { spawn } from "child_process";
import { attach } from "neovim";
import { encode } from '@msgpack/msgpack';
import { ExtensionRuntime } from "../new/ExtensionRuntime";
import { support_mode } from "../new/tasks/vim_to_vscode/support_mode";
import { override_keyboard } from "../new/tasks/vscode_to_vim/override_keyboard";
export function createVim(runtime: ExtensionRuntime): Promise<Vim> {
    const nvim_proc = spawn('nvim', ['-u', 'NONE', '-N', '--embed'], {});
    const vim = attach({ proc: nvim_proc });
    return vim.requestApi().then(api => {
        const data = api[1];
        const fns = data.functions as { name: string }[];
        const symbols = Object.getOwnPropertySymbols(vim);
        if (!(symbols.length === 1 && symbols[0].toString() === 'Symbol(DO_REQUEST)')) {
            throw new Error('Cannot');
        }
        const symbol = symbols[0] as unknown as 'request';
        const instance = fns.reduce((prev, { name }) => {
            (prev as any)[name] = function () {
                return vim[symbol](name, Array.from(arguments));
            } as any;
            return prev;
        }, new EventEmitter() as unknown as Vim);
        (vim as any).transport.parseMessage = function (msg: any[]) {
            const msgType = msg[0];
            if (msgType === 0) {
                // request
                //   - msg[1]: id
                //   - msg[2]: method name
                //   - msg[3]: arguments
                this.emit('request', msg[2].toString(), msg[3], new Response(this.writer, msg[1]));
            }
            else if (msgType === 1) {
                // response to a previous request:
                //   - msg[1]: the id
                //   - msg[2]: error(if any)
                //   - msg[3]: result(if not errored)
                const id = msg[1];
                const handler = this.pending.get(id);
                this.pending.delete(id);
                handler(msg[2], msg[3]);
            }
            else if (msgType === 2) {
                // notification/event
                //   - msg[1]: event name
                //   - msg[2]: arguments
                if (msg[1] === 'redraw') {
                    const cur = msg[2] as any[];
                    for (let i = 0; i < cur.length; i++) {
                        const events = cur[i];
                        const ev = events[0];
                        for (let j = 1; j < events.length; j++) {
                            const args = events[j];
                            if (args.length === 0) {
                                instance.emit(ev);
                            } else if (args.length === 1) {
                                instance.emit(ev, args[0]);
                            } else if (args.length === 2) {
                                instance.emit(ev, args[0], args[1]);
                            } else {
                                instance.emit(ev, ...args);
                            }
                        }

                    }
                }
                instance.emit(msg[1].toString(), ...msg[2]);
            }
            else {
                this.writer.write(this.encodeToBuffer([1, 0, 'Invalid message type', null]));
            }
        };

        support_mode(runtime, instance);
        override_keyboard(runtime, instance);
        
        return vim.uiAttach(1920, 1080, {
            ext_linegrid: true,
            rgb: false,
            ext_hlstate: true,
        } as any).then(() => instance);
    });
}
class Response {
    sent = false;
    constructor(public encoder: any, public requestId: any) {
    }
    send(resp: any, isError: any) {
        if (this.sent) {
            throw new Error(`Response to id ${this.requestId} already sent`);
        }
        const encoded = encode([
            1,
            this.requestId,
            isError ? resp : null,
            !isError ? resp : null,
        ]);
        this.encoder.write(Buffer.from(encoded.buffer, encoded.byteOffset, encoded.byteLength));
        this.sent = true;
    }
}