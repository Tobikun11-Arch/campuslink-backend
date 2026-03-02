import {Request, Response, NextFunction} from 'express';
import {adminService} from '../services/admin.service';

export const adminController = {
  async pendingRoles(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await adminService.listPendingRoles();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },

  async approveRole(req: Request, res: Response, next: NextFunction) {
    try {
      await adminService.approveRole(req.user!.userId, req.params.userId);
      res.status(200).json({message: 'Role approved'});
    } catch (error) {
      next(error);
    }
  },

  async rejectRole(req: Request, res: Response, next: NextFunction) {
    try {
      await adminService.rejectRole(req.user!.userId, req.params.userId);
      res.status(200).json({message: 'Role rejected'});
    } catch (error) {
      next(error);
    }
  },

  async listReports(_req: Request, res: Response, next: NextFunction) {
    try {
      const reports = await adminService.listReports();
      res.status(200).json(reports);
    } catch (error) {
      next(error);
    }
  },

  async resolveReport(req: Request, res: Response, next: NextFunction) {
    try {
      await adminService.resolveReport(req.user!.userId, req.params.reportId);
      res.status(200).json({message: 'Report resolved'});
    } catch (error) {
      next(error);
    }
  }
};
