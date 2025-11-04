import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    number: {
      type: String,
      require: true,
    },

    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
    },
  },
  { timeseries: true }
);

const UserData = mongoose.model("userdata", UserSchema);

export default UserData;
