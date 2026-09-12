import mongoose from 'mongoose';
import Department from '../models/department.model.js';

let inMemoryDepartments = [
  {
    _id: '65f1b1b2c3d4e5f6a7b8c911',
    id: '65f1b1b2c3d4e5f6a7b8c911',
    name: 'Ministry of Road Transport & Highways (MoRTH)',
    createdAt: new Date(),
  },
  {
    _id: '65f1b1b2c3d4e5f6a7b8c912',
    id: '65f1b1b2c3d4e5f6a7b8c912',
    name: 'Ministry of Railways (MoR)',
    createdAt: new Date(),
  },
  {
    _id: '65f1b1b2c3d4e5f6a7b8c913',
    id: '65f1b1b2c3d4e5f6a7b8c913',
    name: 'Ministry of Jal Shakti (DoWR)',
    createdAt: new Date(),
  },
  {
    _id: '65f1b1b2c3d4e5f6a7b8c914',
    id: '65f1b1b2c3d4e5f6a7b8c914',
    name: 'Ministry of Housing & Urban Affairs (MoHUA)',
    createdAt: new Date(),
  },
  {
    _id: '65f1b1b2c3d4e5f6a7b8c915',
    id: '65f1b1b2c3d4e5f6a7b8c915',
    name: 'Ministry of Power & Renewable Energy',
    createdAt: new Date(),
  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

export const departmentDao = {
  findAll: async (query = {}) => {
    if (isDbConnected()) {
      return await Department.find(query).sort({ name: 1 }).lean();
    }
    return inMemoryDepartments;
  },

  findById: async (id) => {
    if (isDbConnected()) {
      return await Department.findById(id).lean();
    }
    return inMemoryDepartments.find((d) => d._id === id || d.id === id) || null;
  },

  create: async (data) => {
    if (isDbConnected()) {
      return (await Department.create({ ...data, createdAt: data.createdAt || new Date() })).toObject();
    }
    const newId = new mongoose.Types.ObjectId().toString();
    const newDept = {
      _id: newId,
      id: newId,
      name: data.name,
      createdAt: new Date(),
    };
    inMemoryDepartments.push(newDept);
    return newDept;
  },

  update: async (id, updateData) => {
    if (isDbConnected()) {
      return await Department.findByIdAndUpdate(id, updateData, { new: true }).lean();
    }
    const index = inMemoryDepartments.findIndex((d) => d._id === id || d.id === id);
    if (index === -1) return null;
    inMemoryDepartments[index] = { ...inMemoryDepartments[index], ...updateData };
    return inMemoryDepartments[index];
  },

  delete: async (id) => {
    if (isDbConnected()) {
      const res = await Department.findByIdAndDelete(id);
      return !!res;
    }
    const index = inMemoryDepartments.findIndex((d) => d._id === id || d.id === id);
    if (index === -1) return false;
    inMemoryDepartments.splice(index, 1);
    return true;
  },
};

export default departmentDao;
