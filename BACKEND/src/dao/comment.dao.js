import mongoose from 'mongoose';
import Comment from '../models/comment.model.js';

let inMemoryComments = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

export const commentDao = {
  findByRef: async (refType, refId) => {
    if (isDbConnected()) {
      return await Comment.find({ refType, refId })
        .populate('authorId', 'username email role')
        .sort({ createdAt: -1 })
        .lean();
    }
    return inMemoryComments.filter((c) => c.refType === refType && String(c.refId) === String(refId));
  },

  findById: async (id) => {
    if (isDbConnected()) {
      return await Comment.findById(id).populate('authorId', 'username email role').lean();
    }
    return inMemoryComments.find((c) => c._id === id || c.id === id) || null;
  },

  create: async (data) => {
    if (isDbConnected()) {
      const created = await Comment.create({ ...data, createdAt: data.createdAt || new Date() });
      return (await Comment.findById(created._id).populate('authorId', 'username email role')).toObject();
    }
    const newId = new mongoose.Types.ObjectId().toString();
    const newComment = {
      _id: newId,
      id: newId,
      refType: data.refType,
      refId: data.refId,
      authorId: data.authorId,
      text: data.text,
      createdAt: new Date(),
    };
    inMemoryComments.unshift(newComment);
    return newComment;
  },

  update: async (id, updateData) => {
    if (isDbConnected()) {
      return await Comment.findByIdAndUpdate(id, updateData, { new: true })
        .populate('authorId', 'username email role')
        .lean();
    }
    const index = inMemoryComments.findIndex((c) => c._id === id || c.id === id);
    if (index === -1) return null;
    inMemoryComments[index] = { ...inMemoryComments[index], ...updateData };
    return inMemoryComments[index];
  },

  delete: async (id) => {
    if (isDbConnected()) {
      const res = await Comment.findByIdAndDelete(id);
      return !!res;
    }
    const index = inMemoryComments.findIndex((c) => c._id === id || c.id === id);
    if (index === -1) return false;
    inMemoryComments.splice(index, 1);
    return true;
  },
};

export default commentDao;
