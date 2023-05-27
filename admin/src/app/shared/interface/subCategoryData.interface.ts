import { categoryData } from "./categoryData.interface";

export interface subCategoryData {
  _id:number,
  subCategoryName:String,
  categoryId:categoryData
}
