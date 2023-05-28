interface KeyValues {
    [key: string]: any
}

const ItemStatuses = {
    ItemStatusInitial: 0,
    ItemStatusOnSale: 1,
    ItemStatusSoldOut: 2,
} as const;

type ItemStatus = (typeof ItemStatuses)[keyof typeof ItemStatuses];

interface Item {
    id: number;
    name: string;
    category_id: number;
    category_name: string;
    user_id: number;
    price: number;
    status: ItemStatus;
    description: string;
}

interface ItemShort {
    id: number;
    name: string;
    price: number;
    category_name: string;
}

