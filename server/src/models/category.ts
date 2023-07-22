import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import mongoosePaginate from "mongoose-paginate-v2";

const plugins = [mongoosePaginate, mongooseDelete];

interface ICategory {
  name: string;
}

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

plugins.forEach((plugin) => {
  categorySchema.plugin(plugin);
});

export default mongoose.model<ICategory>("Category", categorySchema);
