import Joi from "joi";
import Category from "../models/category";
import { Request, Response } from "express";
const categorySchema = Joi.object({
  name: Joi.string().required(),
});

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
  const data = await Category.find(
    condition?.length > 0 ? { $and: [...condition] } : {}
  )
    .limit(+limit)
    .skip(skip)
    .sort({ [sort]: order === "desc" ? -1 : 1 })
    .exec();

  const total = await Category.countDocuments(
    condition?.length > 0 ? { $and: [...condition] } : {}
  );

  return res.status(200).json({
    message: "Get list category success!!",
    data,
    total,
  });
};

export const get = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id).populate("products");
    if (!category) {
      return res.status(200).json({
        message: "No category in database !",
      });
    }
    return res.status(200).json({
      message: "Get category success",
      data: category,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const create = async (req, res) => {
  try {
    const body = req.body;
    const { error } = categorySchema.validate(body);
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.json({
        message: errors,
      });
    }

    const data = await Category.create(body);
    if (!data) {
      return res.status(400).json({
        message: "Add category failed",
      });
    }
    return res.status(200).json({
      message: "Add category success",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }
    return res.status(200).json({
      message: "Xóa danh mục thành công",
      category,
    });
  } catch (error) {
    res.status(400).json({
      message: "Xóa sản phẩm thất bại",
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Category.findByIdAndUpdate(id, req.body, { new: true });
    console.log(req.body);
    if (!data) {
      return res.status(400).json({
        message: "Update category failed",
      });
    }
    return res.status(200).json({
      message: "Update category success",
      data,
    });
  } catch (error) {
    console.log("err");
    return res.status(400).json({
      message: error,
    });
  }
};
