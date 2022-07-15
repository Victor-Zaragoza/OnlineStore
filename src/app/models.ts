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
    location: {
        lat:number;
        lng:number;
    };
}

export interface Order{
    id: string;
    client: Client;
    products: ProductOrder[];
    totalPrice: number; 
    status: StatusOrder;
    date: any;
    score: number;
}

export interface ProductOrder{
    product: Product;
    amount: number;
}

export type StatusOrder= 'send' | 'read' | 'on route' | 'delivered';