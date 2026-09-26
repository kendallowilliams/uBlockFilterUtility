import { KeyValue } from "@angular/common";
import { FormControl } from "@angular/forms";

export type FilterParameters = { [key: string]: string };
export type FilterParameter = KeyValue<string, string>;