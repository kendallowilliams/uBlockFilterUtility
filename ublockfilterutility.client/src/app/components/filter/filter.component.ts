import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FilterModel } from "../../shared/models/filter.model";
import { faEraser, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FormBuilder, FormGroup } from "@angular/forms";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FilterParameter } from "../../shared/models/param.model";
import { getMissingParameters, missingParameters } from "../../shared/validators/template.validators";

@Component({
    selector: 'app-filter',
    templateUrl: 'filter.component.html',
    standalone: false
})
export class FilterComponent implements OnInit, OnChanges {
    @Input() public filter: FilterModel | null = null;
    
    @Output() public isValidChange = new EventEmitter<boolean>();

    protected isEdit = false;
    protected faPlus = faPlus;
    protected faTrash = faTrash;
    protected faEraser = faEraser;
    protected parameters: FilterParameter[] = [];
    protected paramKey?: string | null;
    protected paramValue?: string | null;
    protected filterForm: FormGroup | null = null;
    protected missingParams?: string;

    private destroyRef = inject(DestroyRef);

    constructor(private fb: FormBuilder) {}
    
    public ngOnChanges(changes: SimpleChanges): void {
        if ('filter' in changes) {
            this.reloadParams();
        }
    }

    public ngOnInit(): void {
        this.isEdit = !!this.filter?.Id;
        this.filterForm = this.getForm();
        this.filter = this.filter ?? {};

        this.filterForm.patchValue(this.filter);
        this.reloadParams();
        this.filterForm.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(value => {
                this.filter!.Name = value['Name'];
                this.filter!.Template = value['Template'];
                this.missingParams = getMissingParameters(this.filter!.Template!, this.parameters).join(', ');
                this.isValidChange.emit(this.filterForm?.valid);
            });
    }

    protected handleParamAdd(key: string, value: string): void {
        this.parameters = this.parameters
            .filter(p => p.key !== key)
            .concat({key, value})
            .sort((pThis, pThat) => pThis.key.localeCompare(pThat.key));
        this.paramKey = this.paramValue = null;
        this.filter!.Parameters = {};
        this.parameters.forEach(param => this.filter!.Parameters![param.key] = param.value);
        this.filterForm?.get('Template')?.updateValueAndValidity();
    }

    protected handleParamClear(): void {
        this.paramKey = this.paramValue = null;
    }

    protected handleParamEdit(param: FilterParameter): void {
        this.handleParamRemove(param.key);
        this.paramKey = param.key;
        this.paramValue = param.value;
        this.filterForm?.get('Template')?.updateValueAndValidity();
    }


    protected handleParamRemove(key: string): void {
        this.parameters = this.parameters.filter(p => p.key !== key);
        this.filter!.Parameters = {};
        this.parameters.forEach(param => this.filter!.Parameters![param.key] = param.value);
        this.filterForm?.get('Template')?.updateValueAndValidity();
    }

    private reloadParams(): void {
        const params = this.filter?.Parameters || {};
        this.parameters = Object.keys(params)
            .sort()
            .map(key => ({key, value: params[key]}));
    }

    private getForm(): FormGroup {
        return this.fb.group({
            Id: this.fb.control(null),
            Name: this.fb.control(null),
            Template: this.fb.control(null, missingParameters(() => this.parameters))
        });
    }
}
