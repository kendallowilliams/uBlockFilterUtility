import { Component, Input, OnInit } from "@angular/core";
import { FilterModel, FilterModelForm } from "../../shared/models/filter.model";
import { faCircleExclamation, faEraser, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FormBuilder, FormGroup } from "@angular/forms";
import { FilterParameter, FilterParameterForm } from "../../shared/models/param.model";
import { uniqueKey } from "../../shared/validators/parameter.validators";
import { MessageBoxService } from "../../shared/services/message-box.service";
import { ModalConfig } from "../../shared/models/modal-config.model";
import { MessageBoxModalComponent } from "../modals/message-box-modal/message-box-modal.component";

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

    constructor(private fb: FormBuilder, private messageBoxService: MessageBoxService) {}

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
        const modalConfig: ModalConfig<MessageBoxModalComponent> = {
            options: {
                class: 'modal-lg modal-dialog-centered',
                initialState: {
                    context: { 
                        title: `Update "${param.key}"`, 
                        message: 'Value',
                        initialResponse: param.value
                    }
                }
            }
        };

        this.messageBoxService.prompt(modalConfig)
            .subscribe(response => {
                if (response) {
                    const control = this.form?.controls['Parameters']!;

                    param.value = response;
                    control.setValue(Object.assign({[param.key]: response}, control.value));
                    control.markAsTouched();
                    control.markAsDirty();
                }
            });
    }


    protected handleParamRemove(key: string): void {
        const control = this.form?.controls['Parameters']!;
        let params = control.getRawValue() || {} as FilterModel['Parameters'];
        
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
