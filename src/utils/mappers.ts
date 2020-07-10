import { encode, decode, ExtensionCodec, EncodeOptions, DecodeOptions, Decoder } from '@msgpack/msgpack';

export const extensionCodec = new ExtensionCodec();

export class Extern {
    constructor(public id: number) { }
}

export class Buf extends Extern {
    static encode(input: any) {
        if (input.__val === 'buf') {
            return encode(input.id);
        }
        return null;
    }
    static decode(data: any) {
        return new Buf(decode(data) as number);
    }
    static type = 0;
    private __hook!: 'buf';
}
(Buf as any).prototype['__val'] = 'buf';

export class Win extends Extern {
    static encode(input: any) {
        if (input.__val === 'win') {
            return encode(input.id);
        }
        return null;
    }
    static decode(data: any) {
        return new Win(decode(data) as number);
    }
    static type = 1;

    private __hook!: 'win';
}
(Win as any).prototype['__val'] = 'win';

export class Tab extends Extern {
    static encode(input: any) {
        if (input.__val === 'tab') {
            return encode(input.id);
        }
        return null;
    }
    static decode(data: any) {
        return new Tab(decode(data) as number);
    }
    static type = 2;
    private __hook!: 'tab';
}
(Tab as any).prototype['__val'] = 'tab';


extensionCodec.register(Buf);
extensionCodec.register(Win);
extensionCodec.register(Tab);
