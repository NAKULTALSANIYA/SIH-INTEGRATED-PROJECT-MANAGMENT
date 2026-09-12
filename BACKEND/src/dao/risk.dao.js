import mongoose from 'mongoose';
import Risk from '../models/risk.model.js';

let inMemoryRisks = [
  {
    _id: '65f231b2c3d4e5f6a7b8c991',
    id: '65f231b2c3d4e5f6a7b8c991',
    projectId: '65f1e1b2c3d4e5f6a7b8c941',
    title: 'Monsoon flash flood risk near Wardha river bridge pier foundations',
    description: 'Pier coffer dam reinforcement required to prevent foundation scour.',
    severity: 'high',
    status: 'open',
    createdAt: new Date(),
  },
  {
    _id: '65f231b2c3d4e5f6a7b8c992',
    id: '65f231b2c3d4e5f6a7b8c992',
    projectId: '65f1e1b2c3d4e5f6a7b8c942',
    title: 'Delay in heavy ductile iron pipe supply due to factory strike',
    description: 'Alternate vendor onboarding in progress under fast-track procurement.',
    severity: 'critical',
    status: 'mitigated',
    createdAt: new Date(Date.now() - 86400000),
  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

export const riskDao = {
  findAll: async (query = {}) => {
    if (isDbConnected()) {
      const filter = {};
      if (query.projectId) filter.projectId = query.projectId;
      if (query.severity) filter.severity = query.severity;
      if (query.status) filter.status = query.status;

      return await Risk.find(filter)
        .populate('projectId', 'name status')
        .sort({ createdAt: -1 })
        .lean();
    }

    let filtered = inMemoryRisks;
    if (query.projectId) filtered = filtered.filter((r) => String(r.projectId) === String(query.projectId));
    if (query.severity) filtered = filtered.filter((r) => r.severity === query.severity);
    if (query.status) filtered = filtered.filter((r) => r.status === query.status);
    return filtered;
  },

  findById: async (id) => {
    if (isDbConnected()) {
      return await Risk.findById(id).populate('projectId', 'name status').lean();
    }
    return inMemoryRisks.find((r) => r._id === id || r.id === id) || null;
  },

  create: async (data) => {
    if (isDbConnected()) {
      const created = await Risk.create({ ...data, createdAt: data.createdAt || new Date() });
      return (await Risk.findById(created._id).populate('projectId', 'name status')).toObject();
    }
    const newId = new mongoose.Types.ObjectId().toString();
    const newRisk = {
      _id: newId,
      id: newId,
      projectId: data.projectId,
      title: data.title,
      description: data.description || '',
      severity: data.severity || 'medium',
      status: data.status || 'open',
      createdAt: new Date(),
    };
    inMemoryRisks.unshift(newRisk);
    return newRisk;
  },

  update: async (id, updateData) => {
    if (isDbConnected()) {
      return await Risk.findByIdAndUpdate(id, updateData, { new: true })
        .populate('projectId', 'name status')
        .lean();
    }
    const index = inMemoryRisks.findIndex((r) => r._id === id || r.id === id);
    if (index === -1) return null;
    inMemoryRisks[index] = { ...inMemoryRisks[index], ...updateData };
    return inMemoryRisks[index];
  },

  delete: async (id) => {
    if (isDbConnected()) {
      const res = await Risk.findByIdAndDelete(id);
      return !!res;
    }
    const index = inMemoryRisks.findIndex((r) => r._id === id || r.id === id);
    if (index === -1) return false;
    inMemoryRisks.splice(index, 1);
    return true;
  },
};

export default riskDao;
