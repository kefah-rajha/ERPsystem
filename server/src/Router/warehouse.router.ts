import express from 'express';
import { warehouseController } from '../Controller/warehouse.controller';

const router = express.Router();

router.get('/warehouse/getAllWarehouses', warehouseController.getAllWarehouses);
router.get('/warehouse/stats', warehouseController.getWarehouseCapacityStats);
router.get('/warehouse/getWarehouseById/:id', warehouseController.getWarehouseById);
router.post('/warehouse/createWarehouse', warehouseController.createWarehouse);
router.put('/warehouse/updateWarehouse/:id', warehouseController.updateWarehouse);
router.delete('/warehouse/deleteWarehouse/:id', warehouseController.deleteWarehouse);

export default router;