import { data as generatedData } from "./data";


type DataItem = {
    id: number;
    department: {
        name: string;
    };
    region: string;
    sales: number;
    profit: number;
};


export const load = async () => {
    const data = generatedData as DataItem[]
    
    return {
        data
    }
};