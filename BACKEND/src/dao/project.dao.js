import mongoose from 'mongoose';
import Project from '../models/project.model.js';

let inMemoryProjects = [
  {
    _id: '65f1e1b2c3d4e5f6a7b8c941',
    id: '65f1e1b2c3d4e5f6a7b8c941',
    name: 'Mumbai-Nagpur Samruddhi Expressway Phase-II Extension',
    description: 'Access-controlled 6-lane greenfield super communication expressway integrating 24 talukas and regional logistics nodes.',
    status: 'active',
    startDate: new Date('2022-04-15'),
    endDate: new Date('2025-06-30'),
    budget: 55335.0,
    usedbudget: 42800.0,
    ownerId: {
      _id: '65f1a1b2c3d4e5f6a7b8c901',
      username: 'admin_officer',
      email: 'admin@gov.in',
      role: 'admin',
    },
    teamId: {
      _id: '65f1d1b2c3d4e5f6a7b8c931',
      name: 'National Highway Express Core Engineering Team',
    },
    clientId: {
      _id: '65f1c1b2c3d4e5f6a7b8c921',
      name: 'National Highways Authority of India (NHAI)',
      email: 'info@nhai.gov.in',
    },
    createdAt: new Date('2022-04-01'),
    updatedAt: new Date(),
  },
  {
    _id: '65f1e1b2c3d4e5f6a7b8c942',
    id: '65f1e1b2c3d4e5f6a7b8c942',
    name: 'Saurashtra Rural Surface Water Grid & Tap Pipeline',
    description: 'Bulk water pipeline scheme bringing treated Narmada canal water to 420 fluoride-affected drought-prone villages.',
    status: 'on-hold',
    startDate: new Date('2023-01-10'),
    endDate: new Date('2024-12-31'),
    budget: 4850.0,
    usedbudget: 3620.0,
    ownerId: {
      _id: '65f1a1b2c3d4e5f6a7b8c901',
      username: 'admin_officer',
      email: 'admin@gov.in',
      role: 'admin',
    },
    teamId: null,
    clientId: {
      _id: '65f1c1b2c3d4e5f6a7b8c922',
      name: 'State Infrastructure Board',
      email: 'contact@stateinfra.gov.in',
    },
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date(),
  },
  {
    _id: '65f1e1b2c3d4e5f6a7b8c943',
    id: '65f1e1b2c3d4e5f6a7b8c943',
    name: 'AIIMS Gorakhpur Super-Specialty Medical Wing',
    description: 'Apex tertiary healthcare hospital, emergency trauma care block, and medical college campus.',
    status: 'completed',
    startDate: new Date('2021-08-01'),
    endDate: new Date('2024-03-31'),
    budget: 1011.0,
    usedbudget: 1011.0,
    ownerId: {
      _id: '65f1a1b2c3d4e5f6a7b8c902',
      username: 'project_viewer',
      email: 'viewer@gov.in',
      role: 'user',
    },
    teamId: null,
    clientId: null,
    createdAt: new Date('2021-08-01'),
    updatedAt: new Date(),
  },
  {
    _id: '65f1e1b2c3d4e5f6a7b8c944',
    id: '65f1e1b2c3d4e5f6a7b8c944',
    name: 'Kashmir High-Altitude Solar Renewable Substation',
    description: '500 MW grid-connected high altitude PV solar park with state-of-the-art battery energy storage.',
    status: 'planning',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2026-12-31'),
    budget: 3400.0,
    usedbudget: 250.0,
    ownerId: {
      _id: '65f1a1b2c3d4e5f6a7b8c901',
      username: 'admin_officer',
      email: 'admin@gov.in',
      role: 'admin',
    },
    teamId: null,
    clientId: null,
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date(),
  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

export const projectDao = {
  findAll: async ({ search, status, ownerId, clientId, teamId, page = 1, limit = 50 } = {}) => {
    if (isDbConnected()) {
      const filter = {};
      if (status) filter.status = status;
      if (ownerId) filter.ownerId = ownerId;
      if (clientId) filter.clientId = clientId;
      if (teamId) filter.teamId = teamId;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
      const skip = (Number(page) - 1) * Number(limit);
      const total = await Project.countDocuments(filter);
      const data = await Project.find(filter)
        .populate('ownerId', 'username email role')
        .populate('teamId', 'name members')
        .populate('clientId', 'name email company phone')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();
      return { total, data, page: Number(page), limit: Number(limit) };
    }

    let filtered = [...inMemoryProjects];
    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          (p.description && p.description.toLowerCase().includes(term))
      );
    }
    return {
      total: filtered.length,
      data: filtered,
      page: Number(page),
      limit: Number(limit),
    };
  },

  findById: async (id) => {
    if (isDbConnected()) {
      return await Project.findById(id)
        .populate('ownerId', 'username email role')
        .populate('teamId', 'name members')
        .populate('clientId', 'name email company phone')
        .lean();
    }
    return inMemoryProjects.find((p) => p._id === id || p.id === id) || null;
  },

  create: async (data) => {
    if (isDbConnected()) {
      const created = await Project.create({
        ...data,
        createdAt: data.createdAt || new Date(),
        updatedAt: new Date(),
      });
      return (
        await Project.findById(created._id)
          .populate('ownerId', 'username email role')
          .populate('teamId', 'name')
          .populate('clientId', 'name email company')
      ).toObject();
    }

    const newId = new mongoose.Types.ObjectId().toString();
    const newProj = {
      _id: newId,
      id: newId,
      name: data.name,
      description: data.description || '',
      status: data.status || 'planning',
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      budget: Number(data.budget || 0),
      usedbudget: Number(data.usedbudget || 0),
      ownerId: data.ownerId,
      teamId: data.teamId || null,
      clientId: data.clientId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryProjects.unshift(newProj);
    return newProj;
  },

  update: async (id, updateData) => {
    if (isDbConnected()) {
      return await Project.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true }
      )
        .populate('ownerId', 'username email role')
        .populate('teamId', 'name')
        .populate('clientId', 'name email company')
        .lean();
    }

    const index = inMemoryProjects.findIndex((p) => p._id === id || p.id === id);
    if (index === -1) return null;
    inMemoryProjects[index] = {
      ...inMemoryProjects[index],
      ...updateData,
      updatedAt: new Date(),
    };
    return inMemoryProjects[index];
  },

  delete: async (id) => {
    if (isDbConnected()) {
      const res = await Project.findByIdAndDelete(id);
      return !!res;
    }
    const index = inMemoryProjects.findIndex((p) => p._id === id || p.id === id);
    if (index === -1) return false;
    inMemoryProjects.splice(index, 1);
    return true;
  },

  countByStatus: async () => {
    if (isDbConnected()) {
      const agg = await Project.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 }, totalBudget: { $sum: '$budget' }, totalUsed: { $sum: '$usedbudget' } } },
      ]);
      return agg;
    }
    const counts = {};
    inMemoryProjects.forEach((p) => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return Object.entries(counts).map(([_id, count]) => ({ _id, count }));
  },
};

export default projectDao;
