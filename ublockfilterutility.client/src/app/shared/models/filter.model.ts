export interface FilterModel {
    Id?: number | null;
    Name?: string | null;
    Parameters?: {[key: string]: string},
    Template?: string;
}