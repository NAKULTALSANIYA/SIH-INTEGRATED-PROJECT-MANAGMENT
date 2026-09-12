import mongoose from 'mongoose';
import Team from '../models/team.model.js';

let inMemoryTeams = [
  {
    _id: '65f1d1b2c3d4e5f6a7b8c931',
    id: '65f1d1b2c3d4e5f6a7b8c931',
    name: 'National Highway Express Core Engineering Team',
    members: ['65f1a1b2c3d4e5f6a7b8c901', '65f1a1b2c3d4e5f6a7b8c902'],
    departmentId: '65f1b1b2c3d4e5f6a7b8c911',
    createdAt: new Date(),
  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

export const teamDao = {
  findAll: async (query = {}) => {
    if (isDbConnected()) {
      return await Team.find(query)
        .populate('members', 'username email role')
        .populate('departmentId', 'name')
        .lean();
    }
    return inMemoryTeams;
  },

  findById: async (id) => {
    if (isDbConnected()) {
      return await Team.findById(id)
        .populate('members', 'username email role')
        .populate('departmentId', 'name')
        .lean();
    }
    return inMemoryTeams.find((t) => t._id === id || t.id === id) || null;
  },

  create: async (data) => {
    if (isDbConnected()) {
      const created = await Team.create({ ...data, createdAt: data.createdAt || new Date() });
      return (await Team.findById(created._id).populate('members', 'username email role').populate('departmentId', 'name')).toObject();
    }
    const newId = new mongoose.Types.ObjectId().toString();
    const newTeam = {
      _id: newId,
      id: newId,
      name: data.name,
      members: data.members || [],
      departmentId: data.departmentId || null,
      createdAt: new Date(),
    };
    inMemoryTeams.push(newTeam);
    return newTeam;
  },

  update: async (id, updateData) => {
    if (isDbConnected()) {
      return await Team.findByIdAndUpdate(id, updateData, { new: true })
        .populate('members', 'username email role')
        .populate('departmentId', 'name')
        .lean();
    }
    const index = inMemoryTeams.findIndex((t) => t._id === id || t.id === id);
    if (index === -1) return null;
    inMemoryTeams[index] = { ...inMemoryTeams[index], ...updateData };
    return inMemoryTeams[index];
  },

  delete: async (id) => {
    if (isDbConnected()) {
      const res = await Team.findByIdAndDelete(id);
      return !!res;
    }
    const index = inMemoryTeams.findIndex((t) => t._id === id || t.id === id);
    if (index === -1) return false;
    inMemoryTeams.splice(index, 1);
    return true;
  },
};

export default teamDao;
