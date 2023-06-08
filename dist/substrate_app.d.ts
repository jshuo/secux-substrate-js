/// <reference types="node" />
import { ITransport } from '@secux/transport';
import { ResponseVersion } from './common';
export declare class SubstrateApp {
    transport: ITransport;
    cla: number;
    slip0044: number;
    constructor(transport: ITransport, cla: number, slip0044: number);
    static serializePath(slip0044: number, account: number, change: number, addressIndex: number): Buffer;
    static GetChunks(message: Buffer): Buffer[];
    static signGetChunks(slip0044: number, account: number, change: number, addressIndex: number, message: Buffer): Buffer[];
    getVersion(): Promise<ResponseVersion>;
    appInfo(): Promise<void>;
    signSendChunk(chunkIdx: number, chunkNum: number, chunk: any, scheme?: number): Promise<any>;
    getAddress(account: number, change: number, addressIndex: number, requireConfirmation?: boolean, scheme?: number): Promise<{
        pubKey: string;
        address: string;
    }>;
    sign(account: number, change: number, addressIndex: number, message: Buffer, scheme?: number): Promise<string>;
}
