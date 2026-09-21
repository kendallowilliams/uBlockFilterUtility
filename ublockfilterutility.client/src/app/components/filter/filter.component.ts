import { Component, Input, OnInit } from "@angular/core";
import { FilterModel, FilterModelForm } from "../../shared/models/filter.model";
import { faEraser, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FormGroup } from "@angular/forms";
import { FilterParameter } from "../../shared/models/param.model";

@Component({
    selector: 'app-filter',
    templateUrl: 'filter.component.html',
    standalone: false
})
export class FilterComponent implements OnInit {
    @Input({required: true}) public form: FormGroup<FilterModelForm> | null = null;
    @Input() public isEdit = false;
    protected faPlus = faPlus;
    protected faTrash = faTrash;
    protected faEraser = faEraser;
    protected parameters: FilterParameter[] = [];
    protected paramKey?: string | null;
    protected paramValue?: string | null;
    protected missingParams?: string;
    protected paramKeyDisabled = false;

    public ngOnInit(): void {
        const filter = <FilterModel>this.form?.getRawValue();
        this.displayParams(filter?.Parameters);
    }

    protected handleParamAdd(key: string, value: string): void {
        const control = this.form?.controls['Parameters']!;
        this.parameters = this.parameters
            .filter(p => p.key !== key)
            .concat({key, value})
            .sort((pThis, pThat) => pThis.key.localeCompare(pThat.key));
        this.paramKey = this.paramValue = null;
        this.paramKeyDisabled = false;
        control.setValue(
            Object.assign({}, {[key]: value}, control.value)
        );
        control.markAsTouched();
        control.markAsDirty();
    }

    protected handleParamClear(): void {
        this.paramKey = this.paramValue = null;
        this.paramKeyDisabled = false;
    }

    protected handleParamEdit(param: FilterParameter): void {
        this.handleParamRemove(param.key);
        this.paramKey = param.key;
        this.paramValue = param.value;
        this.paramKeyDisabled = true;
    }


    protected handleParamRemove(key: string): void {
        const control = this.form?.controls['Parameters']!;
        let params = <FilterModel['Parameters']>control.getRawValue() || {};
        
        params = Object.assign({}, params);
        this.parameters = this.parameters.filter(p => p.key !== key);
        delete params[key];
        control!.setValue(params);
        control.markAsTouched();
        control.markAsDirty();
    }

    private displayParams(params: FilterModel['Parameters'] | null): void {
        params = params || {};
        this.parameters = Object.keys(params)
            .sort()
            .map(key => ({key, value: params[key]}));
    }
}
