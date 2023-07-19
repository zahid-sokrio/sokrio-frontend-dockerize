export default interface BaseProduct{
    id: number;
    name: string;
    product_brand_id: number;
    product_category_id: number;
    image_path: string;
    is_stockable: boolean;
    usp: string;
    description: string,
    skus: string,
}
