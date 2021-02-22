"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const auto_scout_router_1 = __importDefault(require("./routes/auto-scout-router"));
const app = express_1.default();
app.use(body_parser_1.default.json());
//Upload csv file
app.use('upload/csv', express_1.default.static(path_1.default.join('upload', 'csv')));
//Error-handling middleware
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
//CORS headers middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});
app.use('/api/', auto_scout_router_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
//# sourceMappingURL=app.js.map