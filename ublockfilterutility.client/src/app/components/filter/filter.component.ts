import { Component, computed, model } from "@angular/core";
import { FilterModel } from "../../shared/models/filter.model";
import { faCircleExclamation, faEraser, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FilterParameter } from "../../shared/models/filter-parameter.model";
import { FieldTree } from "@angular/forms/signals";

@Component({
    selector: 'app-filter',
    templateUrl: 'filter.component.html',
    standalone: false
})
export class FilterComponent {
    public form = model.required<FieldTree<FilterModel>>();
    public isFilterValid = model(true);
    public isEdit = model(false);
    protected formState = computed(() => this.form()());

    protected faPlus = faPlus;
    protected faTrash = faTrash;
    protected faEraser = faEraser;
    protected faCircleExclamation = faCircleExclamation;
    protected parameters: FilterParameter[] = [];
}
