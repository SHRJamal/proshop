import {
  createSchema,
  ExtractDoc,
  ExtractProps,
  Type,
  typedModel,
} from 'ts-mongoose';

const UserSchema = createSchema(
  {
    name: Type.string({
      required: true,
    }),
    email: Type.string({
      required: true,
      unique: true,
    }),
    password: Type.string({
      required: true,
    }),
    isAdmin: Type.string({
      default: false,
    }),
  },
  {
    timestamps: true,
  },
);

export const UserModel = typedModel('User', UserSchema);
export type UserDoc = ExtractDoc<typeof UserSchema>;
export type UserProps = ExtractProps<typeof UserSchema>;