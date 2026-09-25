import { Component, Input, OnInit } from "@angular/core";
import { FilterModel, FilterModelForm } from "../../shared/models/filter.model";
import { faCircleExclamation, faEraser, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FormBuilder, FormGroup } from "@angular/forms";
import { FilterParameter, FilterParameterForm } from "../../shared/models/param.model";
import { uniqueKey } from "../../shared/validators/parameter.validators";

@Component({
    selector: 'app-filter',
    templateUrl: 'filter.component.html',
    standalone: false
})
export class FilterComponent implements OnInit {
    @Input({required: true}) public form: FormGroup<FilterModelForm> | null = null;
    @Input() public isValid = true;
    @Input() public isEdit = false;
    protected faPlus = faPlus;
    protected faTrash = faTrash;
    protected faEraser = faEraser;
    protected faCircleExclamation = faCircleExclamation;
    protected parameters: FilterParameter[] = [];
    protected missingParams?: string;
    protected paramForm: FormGroup<FilterParameterForm> | null = null;

    constructor(private fb: FormBuilder) {}

    public ngOnInit(): void {
        const filter = this.form?.getRawValue() as FilterModel;
        this.displayParams(filter?.Parameters);
        this.paramForm = this.fb.group<FilterParameterForm>({
            Key: this.fb.control(null, uniqueKey(() => this.parameters)),
            Value: this.fb.control(null)
        });
    }

    protected handleParamAdd(): void {
        const control = this.form?.controls['Parameters']!;
        const paramKey = this.paramForm?.controls['Key'].value!;
        const paramValue = this.paramForm?.controls['Value'].value!;
        this.parameters = this.parameters
            .filter(p => p.key !== paramKey)
            .concat({key: paramKey, value: paramValue})
            .sort((pThis, pThat) => pThis.key.localeCompare(pThat.key));
        control.setValue(
            Object.assign({}, {[paramKey]: paramValue}, control.value)
        );
        control.markAsTouched();
        control.markAsDirty();
        this.handleParamClear();
    }

    protected handleParamClear(): void {
        this.paramForm?.reset();
        this.paramForm?.controls['Key'].enable();
    }

    protected handleParamEdit(param: FilterParameter): void {
        this.handleParamRemove(param.key);
        this.paramForm?.reset({Key: param.key, Value: param.value});
        this.paramForm?.markAsTouched();
        this.paramForm?.markAsDirty();
        this.paramForm?.controls['Key'].disable();
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
