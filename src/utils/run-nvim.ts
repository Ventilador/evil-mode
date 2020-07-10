import { spawn } from "child_process";
import { EventEmitter } from "events";
import { encode, DecodeOptions, Decoder } from '@msgpack/msgpack';
import { extensionCodec } from './mappers';
import { Vim } from "../types/api";
import { noop, tryCatchVoid } from "./noop";
const opts: DecodeOptions = { extensionCodec, };

function decodeMulti(value: any, fn: Function) {
    const decoder = new Decoder(extensionCodec, undefined);
    decoder.setBuffer(value); // decodeSync() requires only one buffer
    while (decoder.hasRemaining()) {
        fn(decoder.decodeSync());
    }
}

export type OnEvent = (event: string, calls: any[]) => void;
export function runVim(cb: OnEvent = noop): Promise<EventEmitter & Vim> {
    let lastId = -1;
    const nvim_proc = spawn('nvim', [
        '-u', 'NONE',
        '-n',
        '--embed'
    ], {});
    const base = new EventEmitter();
    const pending: ([Function, Function, ...any[]] | null)[] = Array.from(new Array(100)).map(() => null);
    nvim_proc.stdout.on('data', newData);
    return request('nvim_get_api_info').then((api: any[]) => {
        const data = api[1];
        const fns = data.functions as { name: string }[];
        const instance = fns.reduce((prev, { name }) => {
            (prev as any)[name] = request.bind(null, name);
            return prev;
        }, { quit, raw } as Vim);
        return Object.assign(base, instance);
    });
    function quit() {
        return request('nvim_command', ['!qa']);
    }
    function newData(buf: Buffer) {
        if (process.env.NODE_ENV !== 'production') {
            tryCatchVoid(decodeMulti)(buf, runSingle);
        } else {
            decodeMulti(buf, runSingle);
        }
    }

    function runSingle(msg: any[]) {
        const msgType = msg[0];
        if (msgType === 0) {
            // request
            //   - msg[1]: id
            //   - msg[2]: method name
            //   - msg[3]: arguments
            // base.emit('request', msg[2].toString(), msg[3], new Response(this.writer, msg[1]));
        }
        else if (msgType === 1) {
            // response to a previous request:
            //   - msg[1]: the id
            //   - msg[2]: error(if any)
            //   - msg[3]: result(if not errored)
            const id = msg[1];
            const handler = get(id);
            if (msg[2]) {
                handler[1](msg[2]);
            } else {
                handler[0](msg[3]);
            }
        }
        else if (msgType === 2) {
            // notification/event
            //   - msg[1]: event name
            //   - msg[2]: arguments
            if (process.env.NODE_ENV !== 'production') {
                tryCatchVoid(cb)(msg[1], msg[2]);
            } else {
                cb(msg[1], msg[2]);
            }
        }
        else {
            send([1, 0, 'Invalid message type', null]);
        }
    }

    function send(value: unknown) {
        raw(encode(value, opts));
    }

    function raw(value: string | Uint8Array) {
        nvim_proc.stdin.write(value);
    }

    function request(method: string, ...args: any[]) {
        if (process.env.NODE_ENV !== 'production') {
            return new Promise<any>((resolve, reject) => {
                send([0, put([resolve, reject, method, args]), method, args]);
            });
        } else {
            return new Promise<any>((resolve, reject) => {
                send([0, put([resolve, reject]), method, args]);
            });
        }
    }

    function get(id: number) {
        if (id > pending.length) {
            throw new Error('Invalid id');
        }
        const cur = pending[id];
        if (cur) {
            lastId = id;
            pending[id] = null;
            return cur;
        }

        throw new Error('Invalid id');
    }


    function put(cb: [Function, Function, ...any[]]) {
        // pending2[id++] = cb;
        // return id - 1;
        if (lastId === -1) {
            const result = pending.indexOf(null);
            if (result !== -1) {
                pending[result] = cb;
                return result;
            } else {
                pending.push(cb);

                return pending.length - 1;
            }
        } else {
            const id = lastId;
            pending[id] = cb;
            lastId = -1;

            return id;
        }
    }
}


