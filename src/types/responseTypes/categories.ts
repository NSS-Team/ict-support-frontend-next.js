import { categorySchema } from "../categories/category";
import { subCategorySchema } from "../categories/subCategory";
import { issueOptionSchema } from "../categories/issueOptions";
import { z } from "zod";
import { responseSchema } from "~/lib/responseSchema";

export const getCategoryResponseSchema = responseSchema(z.object({
    categories: z.array(categorySchema),
  }));
export const getSubCategoryResponseSchema = responseSchema(z.object({
    subCategories: z.array(subCategorySchema),
  }));
export const getIssueOptionResponseSchema = responseSchema(z.object({
    issueOptions: z.array(issueOptionSchema),
  }));
export type GetCategoryResponse = z.infer<typeof getCategoryResponseSchema>;
export type GetSubCategoryResponse = z.infer<typeof getSubCategoryResponseSchema>;
export type GetIssueOptionResponse = z.infer<typeof getIssueOptionResponseSchema>;
