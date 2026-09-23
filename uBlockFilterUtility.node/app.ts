import { UboCore } from "./src/ubo-core";

module.exports = {
    isValid: (callback: (error: string | null, isValid: boolean) => void, filters: string[]) => {
        const uboCore = new UboCore();
        const isValid = filters.every(f => uboCore.isValid(f));

        callback(null, isValid);
    
    }
};