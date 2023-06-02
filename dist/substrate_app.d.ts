/// <reference types="node" />
import { ITransport } from '@secux/transport';
import { ResponseVersion } from './common';
export declare class SubstrateApp {
    transport: ITransport;
    cla: number;
    slip0044: number;
    constructor(transport: ITransport, cla: number, slip0044: number);
    static serializePath(slip0044: number, account: number, change: number, addressIndex: number): Buffer;
    getVersion(): Promise<ResponseVersion>;
    appInfo(): Promise<void>;
    getAddress(account: number, change: number, addressIndex: number, requireConfirmation?: boolean, scheme?: number): Promise<void>;
    sign(account: number, change: number, addressIndex: number, message: Buffer, scheme?: number): Promise<void>;
}
