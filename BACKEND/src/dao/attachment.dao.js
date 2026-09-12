import mongoose from 'mongoose';
import Attachment from '../models/attachment.model.js';

let inMemoryAttachments = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

export const attachmentDao = {
  findByRef: async (refType, refId) => {
    if (isDbConnected()) {
      return await Attachment.find({ refType, refId })
        .populate('uploadedBy', 'username email role')
        .sort({ createdAt: -1 })
        .lean();
    }
    return inMemoryAttachments.filter(
      (a) => a.refType === refType && String(a.refId) === String(refId)
    );
  },

  findById: async (id) => {
    if (isDbConnected()) {
      return await Attachment.findById(id).populate('uploadedBy', 'username email role').lean();
    }
    return inMemoryAttachments.find((a) => a._id === id || a.id === id) || null;
  },

  create: async (data) => {
    if (isDbConnected()) {
      const created = await Attachment.create({ ...data, createdAt: data.createdAt || new Date() });
      return (await Attachment.findById(created._id).populate('uploadedBy', 'username email role')).toObject();
    }
    const newId = new mongoose.Types.ObjectId().toString();
    const newAttachment = {
      _id: newId,
      id: newId,
      refType: data.refType,
      refId: data.refId,
      fileName: data.fileName,
      fileUrl: data.fileUrl,
      fileSize: data.fileSize || 0,
      uploadedBy: data.uploadedBy,
      createdAt: new Date(),
    };
    inMemoryAttachments.unshift(newAttachment);
    return newAttachment;
  },

  delete: async (id) => {
    if (isDbConnected()) {
      const res = await Attachment.findByIdAndDelete(id);
      return !!res;
    }
    const index = inMemoryAttachments.findIndex((a) => a._id === id || a.id === id);
    if (index === -1) return false;
    inMemoryAttachments.splice(index, 1);
    return true;
  },
};

export default attachmentDao;
