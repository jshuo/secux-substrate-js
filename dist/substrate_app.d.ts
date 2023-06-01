/// <reference types="node" />
/** ******************************************************************************
 *  (c) 2019 - 2022 ZondaX AG
 *  (c) 2016-2017 Ledger
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ******************************************************************************* */
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
    getAddress(account: number, change: number, addressIndex: number, requireConfirmation?: boolean, scheme?: number): Promise<void>;
    sign(account: number, change: number, addressIndex: number, message: Buffer, scheme?: number): Promise<void>;
}
