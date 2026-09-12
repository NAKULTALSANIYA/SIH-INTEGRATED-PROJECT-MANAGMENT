import mongoose from 'mongoose';
import ActivityLog from '../models/activityLog.model.js';

let inMemoryActivityLogs = [
  {
    _id: '65f221b2c3d4e5f6a7b8c981',
    id: '65f221b2c3d4e5f6a7b8c981',
    userId: {
      _id: '65f1a1b2c3d4e5f6a7b8c901',
      username: 'admin_officer',
      email: 'admin@gov.in',
    },
    action: 'Created project "Kashmir High-Altitude Solar Renewable Substation"',
    refType: 'project',
    refId: '65f1e1b2c3d4e5f6a7b8c944',
    createdAt: new Date(),
  },
  {
    _id: '65f221b2c3d4e5f6a7b8c982',
    id: '65f221b2c3d4e5f6a7b8c982',
    userId: {
      _id: '65f1a1b2c3d4e5f6a7b8c901',
      username: 'admin_officer',
      email: 'admin@gov.in',
    },
    action: 'Updated milestone status to "in-progress"',
    refType: 'milestone',
    refId: '65f1f1b2c3d4e5f6a7b8c952',
    createdAt: new Date(Date.now() - 3600000),
  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

export const activityLogDao = {
  findAll: async (query = {}, limit = 50) => {
    if (isDbConnected()) {
      return await ActivityLog.find(query)
        .populate('userId', 'username email role')
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .lean();
    }
    let filtered = inMemoryActivityLogs;
    if (query.userId) filtered = filtered.filter((a) => a.userId && (String(a.userId._id) === String(query.userId) || String(a.userId) === String(query.userId)));
    if (query.refType) filtered = filtered.filter((a) => a.refType === query.refType);
    return filtered.slice(0, Number(limit));
  },

  create: async (data) => {
    if (isDbConnected()) {
      const created = await ActivityLog.create({
        ...data,
        createdAt: data.createdAt || new Date(),
      });
      return (await ActivityLog.findById(created._id).populate('userId', 'username email role')).toObject();
    }
    const newId = new mongoose.Types.ObjectId().toString();
    const newLog = {
      _id: newId,
      id: newId,
      userId: data.userId,
      action: data.action,
      refType: data.refType || '',
      refId: data.refId || null,
      createdAt: new Date(),
    };
    inMemoryActivityLogs.unshift(newLog);
    return newLog;
  },
};

export default activityLogDao;
