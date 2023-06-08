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

import { ed25519 } from '@noble/curves/ed25519';

const toHexString = (bytes:Uint8Array) => {
  return Array.from(bytes, (byte) => {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
};

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

  async signSendChunk(chunkIdx: number, chunkNum: number, chunk: any, scheme = SCHEME.ED25519) {
    // let payloadType = PAYLOAD_TYPE.ADD
    // if (chunkIdx === 1) {
    //   payloadType = PAYLOAD_TYPE.INIT
    // }
    // if (chunkIdx === chunkNum) {
    //   payloadType = PAYLOAD_TYPE.LAST
    // }

    let p2 = 0
    if (!isNaN(scheme)) p2 = scheme

    return this.transport.Send(0x70, 0xa3, 0, 0, chunk).then(response => {
      // const errorCodeData = response.slice(-2)
      // const returnCode = errorCodeData[0] * 256 + errorCodeData[1]
      // let errorMessage = errorCodeToString(returnCode)
      let signature = null

      // if (returnCode === 0x6a80 || returnCode === 0x6984) {
      //   errorMessage = response.slice(0, response.length - 2).toString('ascii')
      // } else if (response.length > 2) {
      //   signature = response.slice(0, response.length - 2)
      // }

      return {
        signature,
        // return_code: returnCode,
        // error_message: errorMessage,
      }
    }, processErrorResponse)
  }

  async getAddress(
    account: number,
    change: number,
    addressIndex: number,
    requireConfirmation = false,
    scheme = SCHEME.ED25519,
  ){

    let ellipticCurve = 1
    // const bip44Path = SubstrateApp.serializePath(this.slip0044, account, change, addressIndex)
    const { pathBuffer } = buildPathBuffer("m/44'/643'/0'")
    // const { pathBuffer } = buildPathBuffer("m/44/354/0/0/0")
    const pubKey = await this.transport.Send(0x80, 0xc0, ellipticCurve, 0,  pathBuffer)
    console.log(pubKey.data.toString('hex'))
    return {
      pubKey: '3bfe44ad5419cca66549ed49608be9ca79ab08baa8c71b31106d292dc3279afd',
      address: '5DRNDUF3A1p465yaatWtidDiFjgcs8iLKTQX8xxYaMgVdSdU'
    }
  }

  async sign(account: number, change: number, addressIndex: number, message: Buffer, scheme = SCHEME.ED25519) {
    const chunks = SubstrateApp.signGetChunks(this.slip0044, account, change, addressIndex, message)

    const privKey = new Uint8Array([
      16,  18, 137, 159,  79, 193, 178, 101,
      56, 111,  51,  20,  75, 158,  55,  76,
      41, 108,  21, 182, 171,  39,  79, 116,
     148, 242, 169, 236,  44, 230, 157,  65
    ])
     const signature: Uint8Array = ed25519.sign(chunks[1], privKey)
     const typedSignature = new Uint8Array(signature.length+1)
     typedSignature.set(signature, 1);
     typedSignature[0] = 0 // ed25519 
    return toHexString(typedSignature)

    // return this.signSendChunk(1, chunks.length, chunks[0], scheme).then(async () => {
    //   let result
    //   for (let i = 1; i < chunks.length; i += 1) {
    //     result = await this.signSendChunk(1 + i, chunks.length, chunks[i], scheme)
    //     // if (result.return_code !== ERROR_CODE.NoError) {
    //     //   break
    //     // }
    //   }

    //   return {
    //     return_code: result.return_code,
    //     error_message: result.error_message,
    //     signature: result.signature,
    //   }
    // }, processErrorResponse)

    // const signature = 'null'
    // return { signature }
  }

}
