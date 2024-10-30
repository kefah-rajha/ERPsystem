"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_router_1 = __importDefault(require("./Router/auth.router"));
const user_router_1 = __importDefault(require("./Router/user.router"));
const category_router_1 = __importDefault(require("./Router/category.router"));
const products_router_1 = __importDefault(require("./Router/products.router"));
const mongoose_1 = require("mongoose");
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.use((0, cookie_parser_1.default)());
const corsOptions = {
    origin: 'http://your-client-domain.com', // Replace with your client's origin
    credentials: true, // Allow cookies
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
};
app.use((0, cors_1.default)(corsOptions));
(0, mongoose_1.connect)('mongodb://127.0.0.1:27017/ERPsystem').then(() => { console.log("connect is done"); }, (err) => { console.log(err); });
app.use(express_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.use("/api", auth_router_1.default);
app.use("/api", user_router_1.default);
app.use("/api", category_router_1.default);
app.use("/api", products_router_1.default);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
