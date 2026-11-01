import { UserInputError } from "apollo-server-express";

export function pagination(limit = 50, offset = 0): { limit: number; offset: number } {
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new UserInputError("limit must be an integer between 1 and 100");
  }
  if (!Number.isSafeInteger(offset) || offset < 0) {
    throw new UserInputError("offset must be a non-negative safe integer");
  }
  return { limit, offset };
}
