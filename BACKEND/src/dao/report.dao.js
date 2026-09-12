import mongoose from 'mongoose';
import Report from '../models/report.model.js';

let inMemoryReports = [
  {
    _id: '65f241b2c3d4e5f6a7b8c9a1',
    id: '65f241b2c3d4e5f6a7b8c9a1',
    projectId: '65f1e1b2c3d4e5f6a7b8c941',
    type: 'monthly_progress_audit',
    data: {
      physicalProgressPercent: 78,
      financialExpenditurePercent: 77.3,
      qualityScore: 94.2,
      criticalRisksCount: 1,
      safetyIncidents: 0,
    },
    generatedBy: {
      _id: '65f1a1b2c3d4e5f6a7b8c901',
      username: 'admin_officer',
      email: 'admin@gov.in',
    },
    generatedAt: new Date(),
  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

export const reportDao = {
  findAll: async (query = {}) => {
    if (isDbConnected()) {
      const filter = {};
      if (query.projectId) filter.projectId = query.projectId;
      if (query.type) filter.type = query.type;
      return await Report.find(filter)
        .populate('projectId', 'name status budget usedbudget')
        .populate('generatedBy', 'username email role')
        .sort({ generatedAt: -1 })
        .lean();
    }
    let filtered = inMemoryReports;
    if (query.projectId) filtered = filtered.filter((r) => String(r.projectId) === String(query.projectId));
    if (query.type) filtered = filtered.filter((r) => r.type === query.type);
    return filtered;
  },

  findById: async (id) => {
    if (isDbConnected()) {
      return await Report.findById(id)
        .populate('projectId', 'name status budget usedbudget')
        .populate('generatedBy', 'username email role')
        .lean();
    }
    return inMemoryReports.find((r) => r._id === id || r.id === id) || null;
  },

  create: async (data) => {
    if (isDbConnected()) {
      const created = await Report.create({
        ...data,
        generatedAt: data.generatedAt || new Date(),
      });
      return (
        await Report.findById(created._id)
          .populate('projectId', 'name status')
          .populate('generatedBy', 'username email')
      ).toObject();
    }
    const newId = new mongoose.Types.ObjectId().toString();
    const newRep = {
      _id: newId,
      id: newId,
      projectId: data.projectId,
      type: data.type,
      data: data.data || {},
      generatedBy: data.generatedBy || null,
      generatedAt: new Date(),
    };
    inMemoryReports.unshift(newRep);
    return newRep;
  },

  delete: async (id) => {
    if (isDbConnected()) {
      const res = await Report.findByIdAndDelete(id);
      return !!res;
    }
    const index = inMemoryReports.findIndex((r) => r._id === id || r.id === id);
    if (index === -1) return false;
    inMemoryReports.splice(index, 1);
    return true;
  },
};

export default reportDao;
