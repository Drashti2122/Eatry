import { subCategoryData } from "./subCategoryData.iterface";

export interface itemData {
    _id: number;
    itemName: string;
    itemPrice: String;
    itemPicture: String;
    subCategoryId: subCategoryData
}
