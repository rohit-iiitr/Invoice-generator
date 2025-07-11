import mongoose, { Schema } from "mongoose"
import bcrypt from "bcryptjs"
import type { IUser } from "../types"

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    // },
    // company: {
    //   type: String,
    //   trim: true,
    //   maxlength: [100, "Company name cannot exceed 100 characters"],
    // },
    phone: {
      type: String,
      trim: true,
      match: [/^[+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [500, "Address cannot exceed 500 characters"],
    },
   
    // isActive: {
    //   type: Boolean,
    //   default: true,
    // },
    // lastLogin: {
    //   type: Date,
    //   default: null,
    // },
  },
  {
    timestamps: true,
   toJSON: {
  transform(doc, ret: any) {
    delete (ret as any)._id;
    delete (ret as any).__v;
    delete (ret as any).password;
    return ret;
  },
},
  },
)

// Index for better query performance
// UserSchema.index({ email: 1 })
// UserSchema.index({ isActive: 1 })

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    throw new Error("Password comparison failed")
  }
}

export default mongoose.model<IUser>("User", UserSchema)
