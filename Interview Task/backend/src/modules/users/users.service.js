import { ApiError } from '../../utils/ApiError.js';
import User from './users.model.js';

export const getAll = async ({ page = 1, limit = 20, search = '' }) => {
  const query = { isActive: true };
  if (search) {
    query.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password -refreshToken')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }),
    User.countDocuments(query),
  ]);

  return { users, total, page: Number(page), pages: Math.ceil(total / limit) };
};

export const getById = async (id) => {
  const user = await User.findById(id).select('-password -refreshToken');
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const updateProfile = async (id, { name, avatar }) => {
  const user = await User.findByIdAndUpdate(
    id,
    { ...(name && { name }), ...(avatar && { avatar }) },
    { new: true, runValidators: true }
  ).select('-password -refreshToken');
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const updatePreferences = async (id, topicIds) => {
  const user = await User.findByIdAndUpdate(
    id,
    { preferences: topicIds },
    { new: true }
  ).select('preferences');
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const softDelete = async (id) => {
  const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!user) throw new ApiError(404, 'User not found');
};
