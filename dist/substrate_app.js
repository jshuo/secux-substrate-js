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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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
function buildTxBuffer(paths, txs) {
    var head = [], data = [];
    for (var i = 0; i < paths.length; i++) {
        var headerBuffer = Buffer.alloc(4);
        headerBuffer.writeUInt16LE(0, 0);
        headerBuffer.writeUInt16LE(0, 2);
        var path = paths[i];
        var _a = (0, utility_1.buildPathBuffer)(path), pathNum = _a.pathNum, pathBuffer = _a.pathBuffer;
        // generic prepare can use 3 or 5 path level key to sign
        if (pathNum !== 5 && pathNum !== 3)
            throw Error('Invalid Path for Signing Transaction');
        head.push(Buffer.concat([Buffer.from([pathNum * 4 + 4]), headerBuffer, pathBuffer]));
    }
    // fixed 2 byte length
    var preparedTxLenBuf = Buffer.alloc(2);
    preparedTxLenBuf.writeUInt16BE(txs.length, 0);
    data.push(Buffer.concat([preparedTxLenBuf, txs]));
    return Buffer.concat(__spreadArray(__spreadArray([Buffer.from([paths.length])], head, true), data, true));
}
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
    SubstrateApp.prototype.getAddress = function (account, change, addressIndex, requireConfirmation, scheme) {
        if (requireConfirmation === void 0) { requireConfirmation = false; }
        if (scheme === void 0) { scheme = common_1.SCHEME.ED25519; }
        return __awaiter(this, void 0, void 0, function () {
            var bip44Path, rsp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bip44Path = SubstrateApp.serializePath(this.slip0044, account, change, addressIndex);
                        return [4 /*yield*/, this.transport.Send(0x70, 0xa7, 0, 0, Buffer.concat([bip44Path]))];
                    case 1:
                        rsp = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SubstrateApp.prototype.sign = function (account, change, addressIndex, message, scheme) {
        if (scheme === void 0) { scheme = common_1.SCHEME.ED25519; }
        return __awaiter(this, void 0, void 0, function () {
            var bip44Path, rsp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bip44Path = SubstrateApp.serializePath(this.slip0044, account, change, addressIndex);
                        return [4 /*yield*/, this.transport.Send(0x70, 0xa7, 0, 0, Buffer.concat([bip44Path]))];
                    case 1:
                        rsp = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return SubstrateApp;
}());
exports.SubstrateApp = SubstrateApp;
//# sourceMappingURL=substrate_app.js.map