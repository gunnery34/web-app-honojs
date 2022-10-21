"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrieRouter = void 0;
const url_1 = require("../../utils/url");
const node_1 = require("./node");
class TrieRouter {
    constructor() {
        this.node = new node_1.Node();
    }
    add(method, path, handler) {
        const results = (0, url_1.checkOptionalParameter)(path);
        if (results) {
            for (const p of results) {
                this.node.insert(method, p, handler);
            }
            return;
        }
        this.node.insert(method, path, handler);
    }
    match(method, path) {
        return this.node.search(method, path);
    }
}
exports.TrieRouter = TrieRouter;
