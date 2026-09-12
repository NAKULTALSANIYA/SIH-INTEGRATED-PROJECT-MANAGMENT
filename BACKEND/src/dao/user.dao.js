import mongoose from 'mongoose';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

// Seed demo users for fallback when offline
let inMemoryUsers = [
  {
    _id: '65f1a1b2c3d4e5f6a7b8c901',
    id: '65f1a1b2c3d4e5f6a7b8c901',
    username: 'admin_officer',
    email: 'admin@gov.in',
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    isAdmin: true,
    lastLogin: new Date(),
    createdAt: new Date(),
  },
  {
    _id: '65f1a1b2c3d4e5f6a7b8c902',
    id: '65f1a1b2c3d4e5f6a7b8c902',
    username: 'project_viewer',
    email: 'viewer@gov.in',
    passwordHash: bcrypt.hashSync('viewer123', 10),
    role: 'user',
    isAdmin: false,
    lastLogin: new Date(),
    createdAt: new Date(),
  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

export const userDao = {
  findAll: async (query = {}) => {
    if (isDbConnected()) {
      return await User.find(query).select('-passwordHash').lean();
    }
    return inMemoryUsers.map(({ passwordHash, ...rest }) => rest);
  },

  findById: async (id) => {
    if (isDbConnected()) {
      return await User.findById(id).select('-passwordHash').lean();
    }
    const user = inMemoryUsers.find((u) => u._id === id || u.id === id);
    if (!user) return null;
    const { passwordHash, ...rest } = user;
    return rest;
  },

  findByEmailWithPassword: async (email) => {
    if (isDbConnected()) {
      return await User.findOne({ email: email.toLowerCase() }).lean();
    }
    return inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findByEmail: async (email) => {
    if (isDbConnected()) {
      return await User.findOne({ email: email.toLowerCase() }).select('-passwordHash').lean();
    }
    const user = inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    const { passwordHash, ...rest } = user;
    return rest;
  },

  create: async (userData) => {
    if (isDbConnected()) {
      const created = await User.create({
        ...userData,
        createdAt: userData.createdAt || new Date(),
      });
      const obj = created.toObject();
      delete obj.passwordHash;
      return obj;
    }
    const newId = new mongoose.Types.ObjectId().toString();
    const newUser = {
      _id: newId,
      id: newId,
      username: userData.username,
      email: userData.email,
      passwordHash: userData.passwordHash,
      role: userData.role || 'user',
      isAdmin: userData.role === 'admin' || !!userData.isAdmin,
      lastLogin: null,
      createdAt: new Date(),
    };
    inMemoryUsers.push(newUser);
    const { passwordHash, ...rest } = newUser;
    return rest;
  },

  update: async (id, updateData) => {
    if (isDbConnected()) {
      return await User.findByIdAndUpdate(id, updateData, { new: true })
        .select('-passwordHash')
        .lean();
    }
    const index = inMemoryUsers.findIndex((u) => u._id === id || u.id === id);
    if (index === -1) return null;
    inMemoryUsers[index] = {
      ...inMemoryUsers[index],
      ...updateData,
    };
    const { passwordHash, ...rest } = inMemoryUsers[index];
    return rest;
  },

  delete: async (id) => {
    if (isDbConnected()) {
      const res = await User.findByIdAndDelete(id);
      return !!res;
    }
    const index = inMemoryUsers.findIndex((u) => u._id === id || u.id === id);
    if (index === -1) return false;
    inMemoryUsers.splice(index, 1);
    return true;
  },
};

export default userDao;
