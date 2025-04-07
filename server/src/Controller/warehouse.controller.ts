import { Request, Response } from 'express';
import Warehouse, { IWarehouse } from '../Modal/warehouse.model';

export const warehouseController = {
  // Get all warehouses
  getAllWarehouses: async (req: Request, res: Response): Promise<void> => {
    try {
      const warehouses = await Warehouse.find();
      res.status(200).json({
        success: true,
        data: warehouses
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Get single warehouse by ID
  getWarehouseById: async (req: Request, res: Response): Promise<void> => {
    try {
      const warehouse = await Warehouse.findById(req.params.id);
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
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Create new warehouse
  createWarehouse: async (req: Request, res: Response): Promise<void> => {
    try {
      console.log(req.body);
      const warehouse = await Warehouse.create(req.body);
      
      res.status(201).json({
        success: true,
        data: warehouse
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'ValidationError') {
        const messages = Object.values((error as any).errors).map(val => (val as any).message);
        
        res.status(400).json({
          success: false,
           messages
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Server Error'
        });
      }
    }
  },

  // Update warehouse
  updateWarehouse: async (req: Request, res: Response): Promise<void> => {
    try {
      let warehouse = await Warehouse.findById(req.params.id);
      
      if (!warehouse) {
        res.status(404).json({
          success: false,
          error: 'Warehouse not found'
        });
        return;
      }

      warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      res.status(200).json({
        success: true,
        data: warehouse
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Delete warehouse (soft delete by setting isActive to false)
  deleteWarehouse: async (req: Request, res: Response): Promise<void> => {
    try {
      const warehouse = await Warehouse.findById(req.params.id);
      
      if (!warehouse) {
        res.status(404).json({
          success: false,
          message: 'Warehouse not found'
        });
        return;
      }

      await Warehouse.findByIdAndDelete(req.params.id, { isActive: false });

      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  },

  // Get warehouse capacity statistics
  getWarehouseCapacityStats: async (req: Request, res: Response): Promise<void> => {
    try {
      const warehouses = await Warehouse.find({ isActive: true });
      
      const totalCapacity = warehouses.reduce((sum, warehouse) => 
        sum + warehouse.capacity.totalSquareFeet, 0);
      
      const usedCapacity = warehouses.reduce((sum, warehouse) => 
        sum + warehouse.capacity.usedSquareFeet, 0);
      
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
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};
