import mongoose from 'mongoose';
import Task from '../models/task.model.js';

let inMemoryTasks = [
  {
    _id: '65f201b2c3d4e5f6a7b8c961',
    id: '65f201b2c3d4e5f6a7b8c961',
    title: 'Finalize Right-of-Way (RoW) acquisition in Wardha bypass',
    description: 'Coordinate with District Collector revenue officers for compensation settlement.',
    projectId: '65f1e1b2c3d4e5f6a7b8c941',
    milestoneId: '65f1f1b2c3d4e5f6a7b8c951',
    assignedTo: {
      _id: '65f1a1b2c3d4e5f6a7b8c901',
      username: 'admin_officer',
      email: 'admin@gov.in',
    },
    status: 'done',
    priority: 'high',
    dueDate: new Date('2024-05-30'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
  {
    _id: '65f201b2c3d4e5f6a7b8c962',
    id: '65f201b2c3d4e5f6a7b8c962',
    title: 'Deploy Automated Toll Collection & Weigh-in-Motion sensors',
    description: 'Integrate FASTag RFID readers and high-speed ANPR camera barriers.',
    projectId: '65f1e1b2c3d4e5f6a7b8c941',
    milestoneId: '65f1f1b2c3d4e5f6a7b8c952',
    assignedTo: {
      _id: '65f1a1b2c3d4e5f6a7b8c902',
      username: 'project_viewer',
      email: 'viewer@gov.in',
    },
    status: 'in-progress',
    priority: 'critical',
    dueDate: new Date('2024-10-15'),
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date(),
  },
  {
    _id: '65f201b2c3d4e5f6a7b8c963',
    id: '65f201b2c3d4e5f6a7b8c963',
    title: 'Hydrostatic pressure testing of 48-inch MS pipeline',
    description: 'Inspect joint leakages at 1.5x working pressure for 24 continuous hours.',
    projectId: '65f1e1b2c3d4e5f6a7b8c942',
    milestoneId: '65f1f1b2c3d4e5f6a7b8c953',
    assignedTo: null,
    status: 'blocked',
    priority: 'critical',
    dueDate: new Date('2024-07-20'),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date(),
  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

export const taskDao = {
  findAll: async (query = {}) => {
    if (isDbConnected()) {
      const filter = {};
      if (query.projectId) filter.projectId = query.projectId;
      if (query.milestoneId) filter.milestoneId = query.milestoneId;
      if (query.assignedTo) filter.assignedTo = query.assignedTo;
      if (query.status) filter.status = query.status;
      if (query.priority) filter.priority = query.priority;

      return await Task.find(filter)
        .populate('assignedTo', 'username email role')
        .populate('milestoneId', 'title status dueDate')
        .populate('projectId', 'name status')
        .sort({ dueDate: 1, updatedAt: -1 })
        .lean();
    }

    let filtered = inMemoryTasks;
    if (query.projectId) filtered = filtered.filter((t) => t.projectId === query.projectId);
    if (query.status) filtered = filtered.filter((t) => t.status === query.status);
    if (query.priority) filtered = filtered.filter((t) => t.priority === query.priority);
    return filtered;
  },

  findById: async (id) => {
    if (isDbConnected()) {
      return await Task.findById(id)
        .populate('assignedTo', 'username email role')
        .populate('milestoneId', 'title status dueDate')
        .populate('projectId', 'name status')
        .lean();
    }
    return inMemoryTasks.find((t) => t._id === id || t.id === id) || null;
  },

  create: async (data) => {
    if (isDbConnected()) {
      const created = await Task.create({
        ...data,
        createdAt: data.createdAt || new Date(),
        updatedAt: new Date(),
      });
      return (
        await Task.findById(created._id)
          .populate('assignedTo', 'username email role')
          .populate('milestoneId', 'title status')
          .populate('projectId', 'name status')
      ).toObject();
    }

    const newId = new mongoose.Types.ObjectId().toString();
    const newTask = {
      _id: newId,
      id: newId,
      title: data.title,
      description: data.description || '',
      projectId: data.projectId,
      milestoneId: data.milestoneId || null,
      assignedTo: data.assignedTo || null,
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryTasks.unshift(newTask);
    return newTask;
  },

  update: async (id, updateData) => {
    if (isDbConnected()) {
      return await Task.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true }
      )
        .populate('assignedTo', 'username email role')
        .populate('milestoneId', 'title status')
        .populate('projectId', 'name status')
        .lean();
    }

    const index = inMemoryTasks.findIndex((t) => t._id === id || t.id === id);
    if (index === -1) return null;
    inMemoryTasks[index] = {
      ...inMemoryTasks[index],
      ...updateData,
      updatedAt: new Date(),
    };
    return inMemoryTasks[index];
  },

  delete: async (id) => {
    if (isDbConnected()) {
      const res = await Task.findByIdAndDelete(id);
      return !!res;
    }
    const index = inMemoryTasks.findIndex((t) => t._id === id || t.id === id);
    if (index === -1) return false;
    inMemoryTasks.splice(index, 1);
    return true;
  },
};

export default taskDao;
