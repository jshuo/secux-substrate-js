"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubstrateApp = void 0;
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
var utility_1 = require("@secux/utility");
var common_1 = require("./common");
var ed25519_1 = require("@noble/curves/ed25519");
var toHexString = function (bytes) {
    return Array.from(bytes, function (byte) {
        return ('0' + (byte & 0xff).toString(16)).slice(-2);
    }).join('');
};
var SubstrateApp = /** @class */ (function () {
    function SubstrateApp(transport, cla, slip0044) {
        if (!transport) {
            throw new Error('Transport has not been defined');
        }
        this.transport = transport;
        this.cla = cla;
        this.slip0044 = slip0044;
    }
    SubstrateApp.serializePath = function (slip0044, account, change, addressIndex) {
        if (!Number.isInteger(account))
            throw new Error('Input must be an integer');
        if (!Number.isInteger(change))
            throw new Error('Input must be an integer');
        if (!Number.isInteger(addressIndex))
            throw new Error('Input must be an integer');
        var buf = Buffer.alloc(20);
        buf.writeUInt32LE(0x8000002c, 0);
        buf.writeUInt32LE(slip0044, 4);
        buf.writeUInt32LE(account, 8);
        buf.writeUInt32LE(change, 12);
        buf.writeUInt32LE(addressIndex, 16);
        return buf;
    };
    SubstrateApp.GetChunks = function (message) {
        var chunks = [];
        var buffer = Buffer.from(message);
        for (var i = 0; i < buffer.length; i += common_1.CHUNK_SIZE) {
            var end = i + common_1.CHUNK_SIZE;
            if (i > buffer.length) {
                end = buffer.length;
            }
            chunks.push(buffer.slice(i, end));
        }
        return chunks;
    };
    SubstrateApp.signGetChunks = function (slip0044, account, change, addressIndex, message) {
        var chunks = [];
        var bip44Path = SubstrateApp.serializePath(slip0044, account, change, addressIndex);
        chunks.push(bip44Path);
        chunks.push.apply(chunks, SubstrateApp.GetChunks(message));
        return chunks;
    };
    SubstrateApp.prototype.getVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, common_1.getVersion)(this.transport, this.cla)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/, (0, common_1.processErrorResponse)(e_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SubstrateApp.prototype.appInfo = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    SubstrateApp.prototype.signSendChunk = function (chunkIdx, chunkNum, chunk, scheme) {
        if (scheme === void 0) { scheme = common_1.SCHEME.ED25519; }
        return __awaiter(this, void 0, void 0, function () {
            var p2;
            return __generator(this, function (_a) {
                p2 = 0;
                if (!isNaN(scheme))
                    p2 = scheme;
                return [2 /*return*/, this.transport.Send(0x70, 0xa3, 0, 0, chunk).then(function (response) {
                        // const errorCodeData = response.slice(-2)
                        // const returnCode = errorCodeData[0] * 256 + errorCodeData[1]
                        // let errorMessage = errorCodeToString(returnCode)
                        var signature = null;
                        // if (returnCode === 0x6a80 || returnCode === 0x6984) {
                        //   errorMessage = response.slice(0, response.length - 2).toString('ascii')
                        // } else if (response.length > 2) {
                        //   signature = response.slice(0, response.length - 2)
                        // }
                        return {
                            signature: signature,
                            // return_code: returnCode,
                            // error_message: errorMessage,
                        };
                    }, common_1.processErrorResponse)];
            });
        });
    };
    SubstrateApp.prototype.getAddress = function (account, change, addressIndex, requireConfirmation, scheme) {
        if (requireConfirmation === void 0) { requireConfirmation = false; }
        if (scheme === void 0) { scheme = common_1.SCHEME.ED25519; }
        return __awaiter(this, void 0, void 0, function () {
            var ellipticCurve, pathBuffer, pubKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ellipticCurve = 1;
                        pathBuffer = (0, utility_1.buildPathBuffer)("m/44'/643'/0'").pathBuffer;
                        return [4 /*yield*/, this.transport.Send(0x80, 0xc0, ellipticCurve, 0, pathBuffer)];
                    case 1:
                        pubKey = _a.sent();
                        console.log(pubKey.data.toString('hex'));
                        return [2 /*return*/, {
                                pubKey: '3bfe44ad5419cca66549ed49608be9ca79ab08baa8c71b31106d292dc3279afd',
                                address: '5DRNDUF3A1p465yaatWtidDiFjgcs8iLKTQX8xxYaMgVdSdU'
                            }];
                }
            });
        });
    };
    SubstrateApp.prototype.sign = function (account, change, addressIndex, message, scheme) {
        if (scheme === void 0) { scheme = common_1.SCHEME.ED25519; }
        return __awaiter(this, void 0, void 0, function () {
            var chunks, privKey, signature, typedSignature;
            return __generator(this, function (_a) {
                chunks = SubstrateApp.signGetChunks(this.slip0044, account, change, addressIndex, message);
                privKey = new Uint8Array([
                    16, 18, 137, 159, 79, 193, 178, 101,
                    56, 111, 51, 20, 75, 158, 55, 76,
                    41, 108, 21, 182, 171, 39, 79, 116,
                    148, 242, 169, 236, 44, 230, 157, 65
                ]);
                signature = ed25519_1.ed25519.sign(chunks[1], privKey);
                typedSignature = new Uint8Array(signature.length + 1);
                typedSignature.set(signature, 1);
                typedSignature[0] = 0; // ed25519 
                return [2 /*return*/, toHexString(typedSignature)
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
                ];
            });
        });
    };
    return SubstrateApp;
}());
exports.SubstrateApp = SubstrateApp;
//# sourceMappingURL=substrate_app.js.map