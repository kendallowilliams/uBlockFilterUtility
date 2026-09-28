import { Component, model } from "@angular/core";
import { FilterModel } from "../../shared/models/filter.model";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
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

    protected faCircleExclamation = faCircleExclamation;
}
