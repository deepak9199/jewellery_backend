export interface category {
    name: string
    createDate: string
}
export interface category_detail {
    id: string
    name: string
    createDate: string
}
export interface category_detail_selected {
    id: string
    name: string
    createDate: string
    checked: boolean
}
export interface sub_category {
    category_id: string
    name: string
    createDate: string
}
export interface sub_category_detail {
    id: string
    category_id: string
    name: string
    createDate: string
}
export interface sub_category_detail_selected {
    id: string
    category_id: string
    name: string
    createDate: string
    checked: boolean
}
