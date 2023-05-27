import { categoryData } from "./category.interface";

export interface subCategoryData {
    _id: number,
    subCategoryName: String,
    categoryId: categoryData
}
