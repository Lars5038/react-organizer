"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var Global = /** @class */ (function () {
    function Global() {
    }
    Global.prisma = new client_1.PrismaClient();
    return Global;
}());
exports.default = Global;
