import { z, ZodType } from "zod";

const schemaOptions = {
  allowedFileTypes: ["image/png", "image/jpeg", "image/jpg"],
  maxFileSize: 5 * 1024 * 1024, // 5MB
};

export interface FishSchema extends z.infer<typeof fishSchema> {}

export const fishSchema = z.object({
  name: z.string().min(5, { message: "Name must be at least 5 characters" }),
  price: z.coerce.number().default(0),
  stock: z.coerce.number().default(0),
  category: z
    .string()
    .min(5, { message: "Category must be at least 5 characters" }),
  description: z.string().nullable(),
  imageUrl: z.union([
    z
      .instanceof(File)
      .refine((file) => schemaOptions.allowedFileTypes.includes(file.type), {
        message: "Only PNG, JPEG, or JPG images are allowed",
      })
      .refine((file) => file.size <= schemaOptions.maxFileSize, {
        message: `File must be less than ${
          schemaOptions.maxFileSize / (1024 * 1024)
        }MB`,
      }),
    z.string().url().optional(),
  ]),
});
