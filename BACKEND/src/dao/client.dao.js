import mongoose from 'mongoose';
import Client from '../models/client.model.js';

let inMemoryClients = [
  {
    _id: '65f1c1b2c3d4e5f6a7b8c921',
    id: '65f1c1b2c3d4e5f6a7b8c921',
    name: 'National Highways Authority of India (NHAI)',
    email: 'info@nhai.gov.in',
    company: 'Government of India Enterprise',
    phone: '+91-11-25074100',
    createdAt: new Date(),
  },
  {
    _id: '65f1c1b2c3d4e5f6a7b8c922',
    id: '65f1c1b2c3d4e5f6a7b8c922',
    name: 'State Infrastructure Board',
    email: 'contact@stateinfra.gov.in',
    company: 'State Infrastructure Development Corp',
    phone: '+91-22-22027200',
    createdAt: new Date(),
  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

export const clientDao = {
  findAll: async (query = {}) => {
    if (isDbConnected()) {
      return await Client.find(query).sort({ createdAt: -1 }).lean();
    }
    return inMemoryClients;
  },

  findById: async (id) => {
    if (isDbConnected()) {
      return await Client.findById(id).lean();
    }
    return inMemoryClients.find((c) => c._id === id || c.id === id) || null;
  },

  findByEmail: async (email) => {
    if (isDbConnected()) {
      return await Client.findOne({ email: email.toLowerCase() }).lean();
    }
    return inMemoryClients.find((c) => c.email.toLowerCase() === email.toLowerCase()) || null;
  },

  create: async (data) => {
    if (isDbConnected()) {
      return (await Client.create({ ...data, createdAt: data.createdAt || new Date() })).toObject();
    }
    const newId = new mongoose.Types.ObjectId().toString();
    const newClient = {
      _id: newId,
      id: newId,
      name: data.name,
      email: data.email,
      company: data.company || '',
      phone: data.phone || '',
      createdAt: new Date(),
    };
    inMemoryClients.push(newClient);
    return newClient;
  },

  update: async (id, updateData) => {
    if (isDbConnected()) {
      return await Client.findByIdAndUpdate(id, updateData, { new: true }).lean();
    }
    const index = inMemoryClients.findIndex((c) => c._id === id || c.id === id);
    if (index === -1) return null;
    inMemoryClients[index] = { ...inMemoryClients[index], ...updateData };
    return inMemoryClients[index];
  },

  delete: async (id) => {
    if (isDbConnected()) {
      const res = await Client.findByIdAndDelete(id);
      return !!res;
    }
    const index = inMemoryClients.findIndex((c) => c._id === id || c.id === id);
    if (index === -1) return false;
    inMemoryClients.splice(index, 1);
    return true;
  },
};

export default clientDao;
