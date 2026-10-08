import CategoryService from '../services/categoryService.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * @desc    Get all categories for authenticated user
 * @route   GET /api/v1/categories
 * @access  Private (JWT)
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await CategoryService.getUserCategories(req.user.userId, req.query);

    return res
      .status(200)
      .json(new ApiResponse(200, categories, 'Categories retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new custom category
 * @route   POST /api/v1/categories
 * @access  Private (JWT)
 */
export const createCategory = async (req, res, next) => {
  try {
    const category = await CategoryService.createCategory(req.user.userId, req.body);

    return res
      .status(201)
      .json(new ApiResponse(201, category, 'Category created successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing category
 * @route   PUT /api/v1/categories/:id
 * @access  Private (JWT)
 */
export const updateCategory = async (req, res, next) => {
  try {
    const category = await CategoryService.updateCategory(
      req.user.userId,
      req.params.id,
      req.body
    );

    return res
      .status(200)
      .json(new ApiResponse(200, category, 'Category updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a category
 * @route   DELETE /api/v1/categories/:id
 * @access  Private (JWT)
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const result = await CategoryService.deleteCategory(req.user.userId, req.params.id);

    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Category deleted successfully'));
  } catch (error) {
    next(error);
  }
};
