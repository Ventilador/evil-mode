import { encode } from '@msgpack/msgpack';
import { Vim } from "../../../types/api";
import { NeovimClient } from "neovim";

// const append = createWriteStream('C:/Projects/evil-mode/logs.log');
let queue = Promise.resolve();
export function patch_events(instance: Vim, vim: NeovimClient) {
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
                        if (!instance.emit(ev, args)) {
                            console.log(ev);
                        }
                    }
                }
            } else {
                if (!instance.emit(msg[1], msg[2])) {
                    debugger;
                }
            }

        }
        else {
            this.writer.write(this.encodeToBuffer([1, 0, 'Invalid message type', null]));
        }
    };
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
