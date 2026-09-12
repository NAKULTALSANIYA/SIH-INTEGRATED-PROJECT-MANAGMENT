import mongoose from 'mongoose';
import Notification from '../models/notification.model.js';

let inMemoryNotifications = [
  {
    _id: '65f211b2c3d4e5f6a7b8c971',
    id: '65f211b2c3d4e5f6a7b8c971',
    userId: '65f1a1b2c3d4e5f6a7b8c901',
    type: 'milestone',
    message: 'Milestone "Geotechnical Soil Survey" has been successfully completed.',
    isRead: false,
    createdAt: new Date(),
  },
  {
    _id: '65f211b2c3d4e5f6a7b8c972',
    id: '65f211b2c3d4e5f6a7b8c972',
    userId: '65f1a1b2c3d4e5f6a7b8c901',
    type: 'risk',
    message: 'New high-severity risk logged for Saurashtra Bulk Water Pipeline scheme.',
    isRead: false,
    createdAt: new Date(),
  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

export const notificationDao = {
  findByUser: async (userId) => {
    if (isDbConnected()) {
      return await Notification.find({ userId }).sort({ createdAt: -1 }).lean();
    }
    return inMemoryNotifications.filter((n) => String(n.userId) === String(userId));
  },

  create: async (data) => {
    if (isDbConnected()) {
      return (
        await Notification.create({
          ...data,
          isRead: false,
          createdAt: data.createdAt || new Date(),
        })
      ).toObject();
    }
    const newId = new mongoose.Types.ObjectId().toString();
    const newNotif = {
      _id: newId,
      id: newId,
      userId: data.userId,
      type: data.type || 'general',
      message: data.message,
      isRead: false,
      createdAt: new Date(),
    };
    inMemoryNotifications.unshift(newNotif);
    return newNotif;
  },

  markAsRead: async (id) => {
    if (isDbConnected()) {
      return await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true }).lean();
    }
    const index = inMemoryNotifications.findIndex((n) => n._id === id || n.id === id);
    if (index === -1) return null;
    inMemoryNotifications[index].isRead = true;
    return inMemoryNotifications[index];
  },

  markAllAsRead: async (userId) => {
    if (isDbConnected()) {
      await Notification.updateMany({ userId }, { isRead: true });
      return true;
    }
    inMemoryNotifications.forEach((n) => {
      if (String(n.userId) === String(userId)) n.isRead = true;
    });
    return true;
  },

  delete: async (id) => {
    if (isDbConnected()) {
      const res = await Notification.findByIdAndDelete(id);
      return !!res;
    }
    const index = inMemoryNotifications.findIndex((n) => n._id === id || n.id === id);
    if (index === -1) return false;
    inMemoryNotifications.splice(index, 1);
    return true;
  },
};

export default notificationDao;
