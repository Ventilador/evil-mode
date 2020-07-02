import { ExtensionRuntime } from "../../ExtensionRuntime";
import { TwoWayDocument } from "../../TwoWayDocument";

export function set_active(runtime: ExtensionRuntime) {
    return async (doc: TwoWayDocument) => {
        runtime.active = doc;
        await Promise.all([doc.activate(), doc.sync()]);
        return doc;
    };
}