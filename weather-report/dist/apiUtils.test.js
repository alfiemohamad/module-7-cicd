"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiUtils_1 = require("./apiUtils");
describe('sum util', () => {
    it('should add two numbers', () => {
        expect((0, apiUtils_1.sum)(2, 3)).toBe(5);
    });
});
//# sourceMappingURL=apiUtils.test.js.map