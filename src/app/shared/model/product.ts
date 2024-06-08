export interface product {
    retailji_product_id: string
    name: string
    sku_code: string
    discount: number
    mc_per_g: number
    amount: number
    discription: string
    category_id: string
    sub_category_id: string
    images: string[]
    related_items: string[]
    createdTime: String
}
export interface product_detail {
    id: string
    retailji_product_id: string
    name: string
    sku_code: string
    discount: number
    mc_per_g: number
    amount: number
    discription: string
    category_id: string
    sub_category_id: string
    images: string[]
    related_items: string[]
    createdTime: String
}
export interface product_detail_selected {
    id: string
    retailji_product_id: string
    name: string
    sku_code: string
    discount: number
    mc_per_g: number
    amount: number
    discription: string
    category_id: string
    sub_category_id: string
    images: string[]
    related_items: string[]
    checked: boolean
    createdTime: String
}
export interface product_retailji {
    id: number
    item_code: string
    item_name: string
    pcs: number
    basic_rate: number
    purchase_rate: number
    sale_rate: number
    mrp: number
    huid: string
    design: string
    supplier_id: number
    brand_id: number
    purity: string
    bill_no: string
    gwt: number
    nwt: number
    making_per_gm: number
    making: number
    dia_val: number
    stone_val: number
    hallmark: number
    image1: string
    barcode: string
    dia_detail: string
    stone_detail: string
    sku: string
    itemno: number
}
export interface product_retailji_selected {
    id: number
    item_code: string
    item_name: string
    pcs: number
    basic_rate: number
    purchase_rate: number
    sale_rate: number
    mrp: number
    huid: string
    design: string
    supplier_id: number
    brand_id: number
    purity: string
    bill_no: string
    gwt: number
    nwt: number
    making_per_gm: number
    making: number
    dia_val: number
    stone_val: number
    hallmark: number
    image1: string
    barcode: string
    dia_detail: string
    stone_detail: string
    sku: string
    itemno: number
    checked: boolean
}
