import { subCategoryData } from "./subCategoryData.interface";

export interface itemData {
  _id: number;
  itemName: string;
  itemPrice: String;
  itemPicture: String;
  subCategoryId:subCategoryData
}
