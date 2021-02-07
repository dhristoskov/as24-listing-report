"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFilePath = void 0;
const path_1 = __importDefault(require("path"));
const createFilePath = (dir) => {
    return path_1.default.join(__dirname, '../data', dir);
};
exports.createFilePath = createFilePath;
//# sourceMappingURL=filePath.js.map