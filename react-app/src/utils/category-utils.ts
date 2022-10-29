import { Category } from '../models/series.model';
import http from './axiosConfig';

export const getCategoriesRequest = async () => {
  return await http.get<{ categories: Category[] }>(`categories`)
    .then((res) => res.data.categories)
    .catch((err) => {
      throw err;
    });
}

export const saveCategoryRequest = async (newCategory: Category) => {
  return await http.post<{ category: Category }>(`categories`, {
      ...newCategory
    })
    .then((res) => res.data.category)
    .catch((err) => {
      throw err;
    });
}

export const updateCategoryRequest = async (id: number, updatedCategory: Category) => {
  return await http.put<{ message: string }>(`categories/${id}`, {
      ...updatedCategory
    })
    .then((res) => res.data.message)
    .catch((err) => {
      throw err;
    });
}