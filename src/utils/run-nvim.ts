import { spawn } from "child_process";
import { EventEmitter } from "events";
import { encode, decode, ExtensionCodec } from '@msgpack/msgpack';
import { request } from "http";
import { Vim } from "../types/api";
const extensionCodec = new ExtensionCodec();
const opts = { extensionCodec };


export class Extn {
    static encode(input: any) {
        if (input.__val) {
            return encode(input.id);
        }
        return null;
    }
    static decode(data: any) {
        return new this(decode(data) as number);
    }
    constructor(public id: number) { }
}

(Extn as any).prototype['__val'] = true;
export class Buf extends Extn {
    static type = 0;
    private __hook = 'buf';
}
export class Window extends Extn {
    static type = 1;

    private __hook = 'win';
}
export class Tab extends Extn {
    static type = 2;
    private __hook = 'tab';
}

extensionCodec.register(Buf);
extensionCodec.register(Window);
extensionCodec.register(Tab);

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
        const msg = decode(buf, opts) as any[];
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
            console.log('reciving:', id);
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
        if (id > pending.length) {
            throw new Error('Invalid id');
        }
        lastId = id;
        pending[id] = null;
    }

    function getId(cb: Function) {
        if (lastId === -1) {
            const result = pending.indexOf(null);
            if (result !== -1) {
                console.log('sending:', result);
                pending[result] = cb;
                return result;
            } else {
                pending.push(cb);
                console.log('sending:', pending.length - 1);

                return pending.length - 1;
            }
        } else {
            const id = lastId;
            pending[id] = cb;
            lastId = -1;
            console.log('sending:', id);

            return id;
        }
    }
}


