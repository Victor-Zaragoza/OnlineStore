
export interface Product{
    id: string;
    name: string;
    regularPrice: number;
    discountPrice: number;
    image: string;
    date: Date;
}

export interface Client{
    uid: string;
    name: string;
    email: string;
    cellPhone: string;
    image: string;
    reference: string;
    location: any;
}