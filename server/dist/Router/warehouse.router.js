"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const warehouse_controller_1 = require("../Controller/warehouse.controller");
const router = express_1.default.Router();
router.get('/warehouse/getAllWarehouses', warehouse_controller_1.warehouseController.getAllWarehouses);
router.get('/warehouse/stats', warehouse_controller_1.warehouseController.getWarehouseCapacityStats);
router.get('/warehouse/getWarehouseById/:id', warehouse_controller_1.warehouseController.getWarehouseById);
router.post('/warehouse/createWarehouse', warehouse_controller_1.warehouseController.createWarehouse);
router.put('/warehouse/updateWarehouse/:id', warehouse_controller_1.warehouseController.updateWarehouse);
router.delete('/warehouse/deleteWarehouse/:id', warehouse_controller_1.warehouseController.deleteWarehouse);
exports.default = router;
