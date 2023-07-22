import { NextFunction } from "express";
import { IRequestWithUser, IUser } from "../interfaces/user";
import User from "../models/user";

export const getAll = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "asc",
    s,
  } = req.query;
  const skip = (+page - 1) * +limit;
  const textS = (s as string)?.trim();
  const condition: any = [];
  if (textS) {
    condition.push({
      $or: [{ name: { $regex: String(textS), $options: "i" } }],
    });
  }
  const data = await User.find(
    condition?.length > 0 ? { $and: [...condition] } : {}
  )
    .limit(+limit)
    .skip(skip)
    .sort({ [sort]: order === "desc" ? -1 : 1 })
    .exec();

  const total = await User.countDocuments(
    condition?.length > 0 ? { $and: [...condition] } : {}
  );

  return res.status(200).json({
    message: "Get list user success!!",
    data,
    total,
  });
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOneAndDelete({ _id: id });
    res.status(200).json({
      message: "Delete user successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const user = await User.findOneAndUpdate({ _id: id }, body, { new: true });
    res.status(200).json({
      message: "Update user successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin người dùng" });
    }
    return res.status(200).json({
      message: "Lấy thông tin người dùng thành công",
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

export const updateUserProfile = async (req, res, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const userData: IUser = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true,
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({
      message: "Cập nhật tài khoản không thành công",
      error: error.message,
    });
  }
};
