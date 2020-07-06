import { ExtensionRuntime } from "../../ExtensionRuntime";
import { Vim } from "../../../types/api";
import { readFile } from 'fs';
import { promisify } from 'util';
import { resolve } from 'path';
export function patch_keybindings(runtime: ExtensionRuntime, vim: Vim): Promise<void> {
    // todo generate vimrc
    return Promise.resolve();
}