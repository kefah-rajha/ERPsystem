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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseController = void 0;
const warehouse_model_1 = __importDefault(require("../Modal/warehouse.model"));
exports.warehouseController = {
    // Get all warehouses
    getAllWarehouses: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const warehouses = yield warehouse_model_1.default.find();
            res.status(200).json({
                success: true,
                data: warehouses
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }),
    // Get single warehouse by ID
    getWarehouseById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const warehouse = yield warehouse_model_1.default.findById(req.params.id);
            console.log(warehouse);
            if (!warehouse) {
                res.status(404).json({
                    success: false,
                    error: 'Warehouse not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: warehouse
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }),
    // Create new warehouse
    createWarehouse: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(req.body);
            const warehouse = yield warehouse_model_1.default.create(req.body);
            res.status(201).json({
                success: true,
                data: warehouse
            });
        }
        catch (error) {
            if (error instanceof Error && error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(val => val.message);
                res.status(400).json({
                    success: false,
                    messages
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'Server Error'
                });
            }
        }
    }),
    // Update warehouse
    updateWarehouse: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let warehouse = yield warehouse_model_1.default.findById(req.params.id);
            if (!warehouse) {
                res.status(404).json({
                    success: false,
                    error: 'Warehouse not found'
                });
                return;
            }
            warehouse = yield warehouse_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });
            res.status(200).json({
                success: true,
                data: warehouse
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }),
    // Delete warehouse (soft delete by setting isActive to false)
    deleteWarehouse: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const warehouse = yield warehouse_model_1.default.findById(req.params.id);
            if (!warehouse) {
                res.status(404).json({
                    success: false,
                    message: 'Warehouse not found'
                });
                return;
            }
            yield warehouse_model_1.default.findByIdAndDelete(req.params.id, { isActive: false });
            res.status(200).json({
                success: true,
                data: {}
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server Error'
            });
        }
    }),
    // Get warehouse capacity statistics
    getWarehouseCapacityStats: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const warehouses = yield warehouse_model_1.default.find({ isActive: true });
            const totalCapacity = warehouses.reduce((sum, warehouse) => sum + warehouse.capacity.totalSquareFeet, 0);
            const usedCapacity = warehouses.reduce((sum, warehouse) => sum + warehouse.capacity.usedSquareFeet, 0);
            const availableCapacity = totalCapacity - usedCapacity;
            res.status(200).json({
                success: true,
                data: {
                    totalCapacity,
                    usedCapacity,
                    availableCapacity,
                    utilizationPercentage: (usedCapacity / totalCapacity) * 100
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    })
};
