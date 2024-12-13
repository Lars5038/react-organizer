"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var logger_1 = require("./logger");
var Global = /** @class */ (function () {
    function Global() {
    }
    Global.prisma = new client_1.PrismaClient();
    Global.log = new logger_1.default();
    return Global;
}());
exports.default = Global;
