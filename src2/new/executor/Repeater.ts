import { TaskDescriptor } from "./BaseTaskDescriptor";

export class RepeaterDescriptor<TCurrent> extends TaskDescriptor<TCurrent>{
    drop(value: any): void {
        throw new Error("Method not implemented.");
    }

}