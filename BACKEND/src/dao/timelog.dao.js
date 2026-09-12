import mongoose from 'mongoose';
import Timelog from '../models/timelog.model.js';

let inMemoryTimelogs = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

export const timelogDao = {
  findAll: async (query = {}) => {
    if (isDbConnected()) {
      return await Timelog.find(query)
        .populate('taskId', 'title projectId')
        .populate('userId', 'username email')
        .sort({ date: -1 })
        .lean();
    }
    let filtered = inMemoryTimelogs;
    if (query.taskId) filtered = filtered.filter((t) => String(t.taskId) === String(query.taskId));
    if (query.userId) filtered = filtered.filter((t) => String(t.userId) === String(query.userId));
    return filtered;
  },

  findById: async (id) => {
    if (isDbConnected()) {
      return await Timelog.findById(id)
        .populate('taskId', 'title projectId')
        .populate('userId', 'username email')
        .lean();
    }
    return inMemoryTimelogs.find((t) => t._id === id || t.id === id) || null;
  },

  create: async (data) => {
    if (isDbConnected()) {
      const created = await Timelog.create({ ...data, date: data.date ? new Date(data.date) : new Date() });
      return (await Timelog.findById(created._id).populate('taskId', 'title').populate('userId', 'username email')).toObject();
    }
    const newId = new mongoose.Types.ObjectId().toString();
    const newLog = {
      _id: newId,
      id: newId,
      taskId: data.taskId,
      userId: data.userId,
      hours: Number(data.hours),
      description: data.description || '',
      date: data.date ? new Date(data.date) : new Date(),
    };
    inMemoryTimelogs.unshift(newLog);
    return newLog;
  },

  update: async (id, updateData) => {
    if (isDbConnected()) {
      return await Timelog.findByIdAndUpdate(id, updateData, { new: true })
        .populate('taskId', 'title')
        .populate('userId', 'username email')
        .lean();
    }
    const index = inMemoryTimelogs.findIndex((t) => t._id === id || t.id === id);
    if (index === -1) return null;
    inMemoryTimelogs[index] = { ...inMemoryTimelogs[index], ...updateData };
    return inMemoryTimelogs[index];
  },

  delete: async (id) => {
    if (isDbConnected()) {
      const res = await Timelog.findByIdAndDelete(id);
      return !!res;
    }
    const index = inMemoryTimelogs.findIndex((t) => t._id === id || t.id === id);
    if (index === -1) return false;
    inMemoryTimelogs.splice(index, 1);
    return true;
  },
};

export default timelogDao;
