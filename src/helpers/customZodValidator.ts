
import { zValidator } from "@hono/zod-validator";
import { ValidationTargets } from "hono";
import {  ZodType } from "zod";

export  function customZodValidator(target: keyof ValidationTargets, schema: ZodType<any>) {
   return  zValidator(target, schema, (result, c) => {
    if (!result.success) {
      const messages = result.error.issues.map((issue) => {
        return {
          message: issue.message,
          issuesAt: issue.path[0],
        };
      });
      return c.json({ success: false, messages }, 400);
    }
  })
      
}
