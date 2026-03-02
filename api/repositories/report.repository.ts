import { ReportModel } from '../models/Report.model';

export const reportRepository = {
  create: (data: any) => ReportModel.create(data),
  listOpen: () => ReportModel.find({ status: 'OPEN' }).exec(),
  resolve: (reportId: string) => ReportModel.updateOne({ _id: reportId }, { status: 'RESOLVED' }).exec(),
  countReportsForUser: (userId: string) => ReportModel.countDocuments({ reportedUserId: userId }).exec()
};
