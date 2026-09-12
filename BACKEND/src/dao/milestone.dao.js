import mongoose from 'mongoose';
import Milestone from '../models/milestone.model.js';

let inMemoryMilestones = [
  {
    _id: '65f1f1b2c3d4e5f6a7b8c951',
    id: '65f1f1b2c3d4e5f6a7b8c951',
    projectId: '65f1e1b2c3d4e5f6a7b8c941',
    title: 'Geotechnical Soil Survey & Environmental Clearance',
    description: 'Detailed EIA clearance from MoEFCC and seismic stability assessments.',
    dueDate: new Date('2022-09-30'),
    status: 'completed',
    createdAt: new Date('2022-04-10'),
  },
  {
    _id: '65f1f1b2c3d4e5f6a7b8c952',
    id: '65f1f1b2c3d4e5f6a7b8c952',
    projectId: '65f1e1b2c3d4e5f6a7b8c941',
    title: 'Grade Separator & Interchange Civil Works',
    description: 'Construction of 8 high-speed cloverleaf intersections.',
    dueDate: new Date('2024-11-30'),
    status: 'in-progress',
    createdAt: new Date('2023-01-10'),
  },
  {
    _id: '65f1f1b2c3d4e5f6a7b8c953',
    id: '65f1f1b2c3d4e5f6a7b8c953',
    projectId: '65f1e1b2c3d4e5f6a7b8c942',
    title: 'Intake Well Submerged Pumping Machinery Installation',
    description: 'High-capacity vertical turbine pumps delivery and electrical grid sync.',
    dueDate: new Date('2023-10-15'),
    status: 'delayed',
    createdAt: new Date('2023-02-01'),
  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

export const milestoneDao = {
  findAll: async (query = {}) => {
    if (isDbConnected()) {
      return await Milestone.find(query).sort({ dueDate: 1 }).populate('projectId', 'name status').lean();
    }
    let filtered = inMemoryMilestones;
    if (query.projectId) {
      filtered = filtered.filter((m) => m.projectId === query.projectId || (m.projectId && m.projectId._id === query.projectId));
    }
    return filtered;
  },

  findById: async (id) => {
    if (isDbConnected()) {
      return await Milestone.findById(id).populate('projectId', 'name status').lean();
    }
    return inMemoryMilestones.find((m) => m._id === id || m.id === id) || null;
  },

  findByProject: async (projectId) => {
    if (isDbConnected()) {
      return await Milestone.find({ projectId }).sort({ dueDate: 1 }).lean();
    }
    return inMemoryMilestones.filter((m) => m.projectId === projectId || (m.projectId && m.projectId._id === projectId));
  },

  create: async (data) => {
    if (isDbConnected()) {
      return (await Milestone.create({ ...data, createdAt: data.createdAt || new Date() })).toObject();
    }
    const newId = new mongoose.Types.ObjectId().toString();
    const newM = {
      _id: newId,
      id: newId,
      projectId: data.projectId,
      title: data.title,
      description: data.description || '',
      dueDate: new Date(data.dueDate),
      status: data.status || 'pending',
      createdAt: new Date(),
    };
    inMemoryMilestones.push(newM);
    return newM;
  },

  update: async (id, updateData) => {
    if (isDbConnected()) {
      return await Milestone.findByIdAndUpdate(id, updateData, { new: true }).lean();
    }
    const index = inMemoryMilestones.findIndex((m) => m._id === id || m.id === id);
    if (index === -1) return null;
    inMemoryMilestones[index] = { ...inMemoryMilestones[index], ...updateData };
    return inMemoryMilestones[index];
  },

  delete: async (id) => {
    if (isDbConnected()) {
      const res = await Milestone.findByIdAndDelete(id);
      return !!res;
    }
    const index = inMemoryMilestones.findIndex((m) => m._id === id || m.id === id);
    if (index === -1) return false;
    inMemoryMilestones.splice(index, 1);
    return true;
  },
};

export default milestoneDao;
