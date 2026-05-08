import { Post } from "../types";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validatePost(post: Partial<Post>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!post.title || post.title.trim().length < 10) {
    errors.title = "Title must be at least 10 characters long.";
  }

  if (!post.description || post.description.trim().length < 20) {
    errors.description = "Description must be at least 20 characters long.";
  } else if (post.description.trim().length > 160) {
    errors.description = "Description must be at most 160 characters long.";
  }

  if (!post.content || post.content.trim().length < 50) {
    errors.content = "Content must be at least 50 characters long.";
  }

  if (!post.category) {
    errors.category = "Please select a category.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
