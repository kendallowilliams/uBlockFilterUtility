import { Component, computed,  model, signal } from '@angular/core';
import { FilterParameter, FilterParameters } from '../../shared/models/filter-parameter.model';
import { disabled, form, FormValueControl, required, validate } from '@angular/forms/signals';
import { faEraser, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { MessageBoxService } from '../../shared/services/message-box.service';
import { ModalConfig } from '../../shared/models/modal-config.model';
import { MessageBoxModalComponent } from '../modals/message-box-modal/message-box-modal.component';
import { FilterUtils } from '../../shared/utils/filter.utils';

@Component({
  selector: 'app-parameter-list',
  standalone: false,
  templateUrl: './parameter-list.component.html',
})
export class ParameterListComponent implements FormValueControl<FilterParameters> {
    public readonly value = model<FilterParameters>({});
    
    protected faPlus = faPlus;
    protected faEraser = faEraser;
    protected faSave = faSave;
    protected parameters = computed<FilterParameter[]>(() => this.value() ? FilterUtils.toParameterArray(this.value()) : []);
    protected model = signal<FilterParameter>({key: '', value: ''})
    protected form = form<FilterParameter>(this.model, schema => {
        required(schema.key, {when: field => field.state.touched()}),
        required(schema.value, {when: field => field.state.touched()}),
        disabled(schema.key, {when: () => !this.isEditing()}),
        disabled(schema.value, {when: () => !this.isEditing()}),
        validate(schema.key, ({value}) => {
            return FilterUtils.isDuplicateKey(value(), this.parameters()) 
                ? 
                {
                    kind: 'duplicate'
                } 
                : null
            }
        )
    });
    protected isEditing = signal(false);
    protected canSave = computed(() => this.form().valid());

    constructor(private messageBoxService: MessageBoxService) {}

    protected handleParamAdd(): void {
        this.isEditing.set(true);
        this.form().reset({key: '', value: ''});
    }

    protected handleParamSave(): void {
        const param = {[this.model().key]: this.model().value};
        this.value.set(Object.assign({...this.value()}, param));
        this.handleParamClear();
    }

    protected handleParamClear(): void {
        this.form().reset({key: '', value: ''});
        this.isEditing.set(false);
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
                    param.value = response;
                    this.value.set(Object.assign({...this.value()}, {[param.key]: response}));
                }
            });
    }


    protected handleParamRemove(key: string): void {
        let params = Object.assign({}, this.value()); 
        
        delete params[key];
        this.value.set(params);
    }
  }
