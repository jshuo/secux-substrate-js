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
import { buildPathBuffer } from '@secux/utility'
import { ITransport } from '@secux/transport';
import {
  CHUNK_SIZE,
  getVersion,
  processErrorResponse,
  ResponseVersion,
  SCHEME,
} from './common'


function buildTxBuffer(paths: Array<string>, txs: Buffer) {
  const head = [],
    data = []
  for (let i = 0; i < paths.length; i++) {
    const headerBuffer = Buffer.alloc(4)
    headerBuffer.writeUInt16LE(0, 0)
    headerBuffer.writeUInt16LE(0, 2)

    const path = paths[i]
    const { pathNum, pathBuffer } = buildPathBuffer(path)
    // generic prepare can use 3 or 5 path level key to sign
    if (pathNum !== 5 && pathNum !== 3) throw Error('Invalid Path for Signing Transaction')

    head.push(Buffer.concat([Buffer.from([pathNum * 4 + 4]), headerBuffer, pathBuffer]))
  }
  // fixed 2 byte length
  const preparedTxLenBuf = Buffer.alloc(2)
  preparedTxLenBuf.writeUInt16BE(txs.length, 0)
  data.push(Buffer.concat([preparedTxLenBuf, txs]))
  return Buffer.concat([Buffer.from([paths.length]), ...head, ...data])
}

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
    const rsp = await this.transport.Send(0x70, 0xa7, 0, 0, Buffer.concat([bip44Path]))
  }

  async sign(account: number, change: number, addressIndex: number, message: Buffer, scheme = SCHEME.ED25519) {
    const bip44Path = SubstrateApp.serializePath(this.slip0044, account, change, addressIndex)
    const rsp = await this.transport.Send(0x70, 0xa7, 0, 0, Buffer.concat([bip44Path]))
  }

}
