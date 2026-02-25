import { UserModel, UserDocument } from '../models/User.model';

export const userRepository = {
  findByEmail: (email: string) => UserModel.findOne({ email }).exec(),
  findById: (id: string) => UserModel.findById(id).exec(),
  create: (data: Partial<UserDocument>) => UserModel.create(data),
  updateVerification: (email: string, code?: string, expiry?: Date) =>
    UserModel.updateOne({ email }, { verificationCode: code, verificationExpiry: expiry }).exec(),
  markVerified: (email: string) =>
    UserModel.updateOne({ email }, { isVerified: true, verificationCode: null, verificationExpiry: null }).exec(),
  listPendingRoles: () => UserModel.find({ roleStatus: 'PENDING' }).exec(),
  listAll: () => UserModel.find({}).exec(),
  updateRoleStatus: (userId: string, roleStatus: 'VERIFIED' | 'REJECTED') =>
    UserModel.updateOne({ _id: userId }, { roleStatus }).exec(),
  addFollower: (userId: string, followerId: string) =>
    UserModel.updateOne({ _id: userId }, { $addToSet: { followers: followerId } }).exec(),
  addFollowing: (userId: string, followingId: string) =>
    UserModel.updateOne({ _id: userId }, { $addToSet: { following: followingId } }).exec(),
  removeFollower: (userId: string, followerId: string) =>
    UserModel.updateOne({ _id: userId }, { $pull: { followers: followerId } }).exec(),
  removeFollowing: (userId: string, followingId: string) =>
    UserModel.updateOne({ _id: userId }, { $pull: { following: followingId } }).exec(),
  incrementContribution: (userId: string, amount: number) =>
    UserModel.updateOne({ _id: userId }, { $inc: { contributionScore: amount } }).exec(),
  addBadge: (userId: string, badge: string) =>
    UserModel.updateOne({ _id: userId }, { $addToSet: { badges: badge } }).exec(),
  setBadges: (userId: string, badges: string[]) =>
    UserModel.updateOne({ _id: userId }, { badges }).exec(),
  setContribution: (userId: string, contributionScore: number) =>
    UserModel.updateOne({ _id: userId }, { contributionScore }).exec(),
  setGlobalRank: (userId: string, globalRank: number) =>
    UserModel.updateOne({ _id: userId }, { globalRank }).exec(),
  updateReputation: (userId: string, reputationScore: number) =>
    UserModel.updateOne({ _id: userId }, { reputationScore }).exec()
};
