import { Injectable } from '@nestjs/common';

@Injectable()
export class QuotaRepositoryService {

    private static mockDB : Map<string, number>;

    constructor(){
        QuotaRepositoryService.mockDB = new Map<string, number>();
        this.cleanScecdure();
    }

    private static clearDatabase(){
        this.mockDB = new Map<string, number>();
        console.log("Clearing quota database...");
    }

    private cleanScecdure(){
        setTimeout(() => {
            QuotaRepositoryService.clearDatabase();
            this.cleanScecdure();
        }, 1000 * 60);
    }

    private get DB(){
        return QuotaRepositoryService.mockDB;
    }

    totalExcete(ip: string){
        this.createIfNotExists(ip);
        return this.DB.get(ip);
    }
    decreset(ip: string){
        this.createIfNotExists(ip);
        const amount = this.totalExcete(ip) - 1;
        this.DB.set(ip, amount);
        return amount;
    }
    increset(ip: string){
        this.createIfNotExists(ip);
        const amount = this.totalExcete(ip) + 1;
        this.DB.set(ip, amount);
        return amount;
    }

    private createIfNotExists(ip: string){
        const isExist = this.DB.has(ip);
        if(!isExist){
            this.DB.set(ip, 0);
        }
    }

}
