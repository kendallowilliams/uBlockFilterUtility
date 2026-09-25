import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FilterModel } from "../models/filter.model";
import { APP_BASE_HREF } from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class FilterService {
    private readonly baseHref = inject(APP_BASE_HREF);
    private readonly apiUrl = `${this.baseHref}api/Filter`;

    constructor(private http: HttpClient) {}

    public getFilters(): Observable<FilterModel[]> {
        return this.http.get<FilterModel[]>(`${this.apiUrl}/Filters`);
    }

    public addFilter(filter: FilterModel): Observable<FilterModel> {
        return this.http.post<FilterModel>(`${this.apiUrl}/Filter`, filter);
    }

    public updateFilter(filter: FilterModel): Observable<FilterModel> {
        return this.http.post<FilterModel>(`${this.apiUrl}/Filter`, filter);
    }

    public deleteFilter(id: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.apiUrl}/Filter/${id}`);
    }

    public getPreview(id: number): Observable<string> {
        return this.http.get<string>(`${this.apiUrl}/Preview/${id}`);
    }

    public isFilterValid(id: number): Observable<boolean> {
      return this.http.get<boolean>(`${this.apiUrl}/IsFilterValid/${id}`);
    }

    public getExportUrl: () => string = (): string => `${this.apiUrl}/Generate`;
}
