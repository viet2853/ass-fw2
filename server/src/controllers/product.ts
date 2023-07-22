import { Request, Response } from "express";
import { IProduct } from "../interfaces/product";
import { IUser } from "../interfaces/user";
import Category from "../models/category";
import Product from "../models/product";
import { productSchema } from "../schemas/product";

export const getAll = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    orderBy = "asc",
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
  const data = await Product.find(
    condition?.length > 0 ? { $and: [...condition] } : {}
  )
    .limit(+limit)
    .skip(skip)
    .sort({ [sortBy]: orderBy === "desc" ? -1 : 1 })
    .exec();

  const total = await Product.countDocuments(
    condition?.length > 0 ? { $and: [...condition] } : {}
  );

  return res.status(200).json({
    message: "Get list product success!!",
    data,
    total,
  });
};

export const get = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new Error("Product not found");
    return res.status(200).json({ data: product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
export const create = async (req: Request, res: Response) => {
  try {
    const { error } = productSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((message) => ({ message }));
      return res.status(400).json({ errors });
    }
    // Thêm sản phẩm vào database
    const product = await Product.create(req.body);

    await Category.findOneAndUpdate(product.categoryId, {
      $addToSet: {
        products: product._id,
      },
    });
    return res.status(200).json({
      message: "Add product success",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Thêm sản phẩm không thành công",
      error: error.message,
    });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    const { error } = productSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        messages: error.details.map((message) => ({ message })),
      });
    }
    // Tìm sản phẩm theo id và cập nhật dữ liệu mới
    const productId = req.params.id;
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.sendStatus(404);
    }

    // Xóa sản phẩm cũ khỏi danh sách products của category cũ
    // const oldCategoryId = updatedProduct.categoryId;
    // await Category.findByIdAndUpdate(oldCategoryId, {
    //   $pull: { products: productId },
    // });

    // // Thêm sản phẩm mới vào danh sách products của category mới
    // const newCategoryId = req.body.categoryId;
    // if (newCategoryId) {
    //   // Thêm sản phẩm mới vào danh sách products của category mới
    //   await Category.findByIdAndUpdate(newCategoryId, {
    //     $addToSet: { products: productId },
    //   });
    // }
    return res.status(200).json({
      message: "Update product success",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Cập nhật sản phẩm không thành công",
      error: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const data = await Product.findByIdAndDelete(req.params.id);
    return res.json({
      message: "Delete product success",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const restore = async (req, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = req.user as IUser;
    const product = (await Product.findById(id)) as IProduct;

    if (!user.role || user.role !== "admin") {
      return res.status(403).json({
        message: "Bạn không có quyền phục hồi sản phẩm",
      });
    }
    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }
    if (!product.deleted) {
      return res.status(400).json({
        message: "Sản phẩm chưa bị xóa mềm",
      });
    }

    product.deleted = false;
    product.deletedAt = null;

    const restoredProduct = await product.save();

    return res.status(200).json({
      message: "Phục hồi sản phẩm thành công",
      data: restoredProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: "Phục hồi sản phẩm không thành công",
      error: error.message,
    });
  }
};
