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
import {
  CHUNK_SIZE,
  errorCodeToString,
  ERROR_CODE,
  getVersion,
  INS,
  PAYLOAD_TYPE,
  processErrorResponse,
  ResponseAddress,
  ResponseAllowlistHash,
  ResponseAllowlistPubKey,
  ResponseSign,
  ResponseVersion,
  SCHEME,
} from './common'

export class SubstrateApp {
  transport: ITransport
  cla: number
  slip0044: number

  constructor(transport: ITransport, cla: number, slip0044: number) {
    if (!transport) {
      throw new Error('Transport has not been defined')
    }
    this.transport = transport
    this.cla = cla
    this.slip0044 = slip0044
  }

  static serializePath(slip0044: number, account: number, change: number, addressIndex: number) {
    if (!Number.isInteger(account)) throw new Error('Input must be an integer')
    if (!Number.isInteger(change)) throw new Error('Input must be an integer')
    if (!Number.isInteger(addressIndex)) throw new Error('Input must be an integer')

    const buf = Buffer.alloc(20)
    buf.writeUInt32LE(0x8000002c, 0)
    buf.writeUInt32LE(slip0044, 4)
    buf.writeUInt32LE(account, 8)
    buf.writeUInt32LE(change, 12)
    buf.writeUInt32LE(addressIndex, 16)
    return buf
  }

  static GetChunks(message: Buffer) {
    const chunks = []
    const buffer = Buffer.from(message)

    for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
      let end = i + CHUNK_SIZE
      if (i > buffer.length) {
        end = buffer.length
      }
      chunks.push(buffer.slice(i, end))
    }

    return chunks
  }

  static signGetChunks(slip0044: number, account: number, change: number, addressIndex: number, message: Buffer) {
    const chunks = []
    const bip44Path = SubstrateApp.serializePath(slip0044, account, change, addressIndex)
    chunks.push(bip44Path)
    chunks.push(...SubstrateApp.GetChunks(message))
    return chunks
  }

  async getVersion(): Promise<ResponseVersion> {
    try {
      return await getVersion(this.transport, this.cla)
    } catch (e) {
      return processErrorResponse(e)
    }
  }

  async appInfo() {  }

  async getAddress(
    account: number,
    change: number,
    addressIndex: number,
    requireConfirmation = false,
    scheme = SCHEME.ED25519,
  ){
    const bip44Path = SubstrateApp.serializePath(this.slip0044, account, change, addressIndex)

    let p1 = 0
    if (requireConfirmation) p1 = 1

    let p2 = 0
    if (!isNaN(scheme)) p2 = scheme
    const txBuffer: Buffer = Buffer.allocUnsafe(10)
    const rsp = await this.transport.Send(0x70, 0xa7, 0, 0, Buffer.concat([txBuffer]))
  }

  async sign(account: number, change: number, addressIndex: number, message: Buffer, scheme = SCHEME.ED25519) {
    const txBuffer: Buffer = Buffer.allocUnsafe(10)
    const rsp = await this.transport.Send(0x70, 0xa7, 0, 0, Buffer.concat([txBuffer]))
  }

}
