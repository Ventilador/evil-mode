import { spawn } from "child_process";
import { EventEmitter } from "events";
import { encode, DecodeOptions, Decoder } from '@msgpack/msgpack';
import { extensionCodec } from './mappers';
import { Vim } from "../types/api";
const opts: DecodeOptions = { extensionCodec, };

function decodeMulti(value: any, fn: Function) {
    const decoder = new Decoder(extensionCodec, undefined);
    decoder.setBuffer(value); // decodeSync() requires only one buffer
    while (decoder.hasRemaining()) {
        fn(decoder.decodeSync());
    }

}


export function run(): Promise<EventEmitter & Vim> {
    let lastId = -1;
    const nvim_proc = spawn('nvim', [
        '-u', 'NONE',
        '-n',
        '--embed'
    ], {});
    const base = new EventEmitter();
    const pending: (Function | null)[] = Array.from(new Array(100)).map(() => null);
    nvim_proc.stdout.on('data', newData);
    return request('nvim_get_api_info').then((api: any[]) => {
        const data = api[1];
        const fns = data.functions as { name: string }[];
        const instance = fns.reduce((prev, { name }) => {
            (prev as any)[name] = request.bind(null, name);
            return prev;
        }, { quit: () => { request('nvim_command', ['!qa']); } } as Vim);
        return Object.assign(base, instance);
    });

    function newData(buf: Buffer) {
        try {
            decodeMulti(buf, runSingle);
        } catch (err) {
            err;
            debugger;
            return;
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
            release(id);
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
                        if (!base.emit(ev, args)) {
                            console.log(ev);
                        }
                    }
                }
            } else {
                if (!base.emit(msg[1], msg[2])) {
                    debugger;
                }
            }

        }
        else {
            send([1, 0, 'Invalid message type', null]);
        }
    }

    function send(value: unknown) {
        nvim_proc.stdin.write(encode(value, opts));
    }
    function request(method: string, ...args: any[]) {
        return new Promise<any>((resolve, reject) => {
            send([0, getId((e: any, v: any) => {
                if (e) {
                    method;
                    args;
                    debugger;
                    reject(e);
                } else {
                    resolve(v);
                }
            }), method, args]);
        });
    }


    function get(id: number) {
        if (id > pending.length) {
            throw new Error('Invalid id');
        }
        const cur = pending[id];
        if (cur) {
            return cur;
        }

        throw new Error('Invalid id');
    }
    function release(id: number) {
        // delete pending2[id];
        if (id > pending.length) {
            throw new Error('Invalid id');
        }
        lastId = id;
        pending[id] = null;
    }

    function getId(cb: Function) {
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


