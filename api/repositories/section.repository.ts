import { SectionGroupModel } from '../models/SectionGroup.model';

export const sectionRepository = {
  findById: (id: string) => SectionGroupModel.findById(id).exec(),
  updateInvite: (id: string, inviteToken: string, inviteExpiry: Date) =>
    SectionGroupModel.updateOne({ _id: id }, { inviteToken, inviteExpiry }).exec(),
  addMember: (id: string, userId: string) =>
    SectionGroupModel.updateOne({ _id: id }, { $addToSet: { members: userId } }).exec()
};
