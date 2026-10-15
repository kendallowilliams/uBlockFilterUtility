import { Component, computed, model } from "@angular/core";
import { FilterModel } from "../../shared/models/filter.model";
import { faCircleExclamation, faToiletPaper } from "@fortawesome/free-solid-svg-icons";
import { FieldTree } from "@angular/forms/signals";

@Component({
    selector: 'app-filter',
    templateUrl: 'filter.component.html',
    standalone: false
})
export class FilterComponent {
    public form = model.required<FieldTree<FilterModel>>();
    public isFilterValid = model(true);
    public isEdit = computed(() => this.form().Id().value() > 0);

    protected isDirty = computed(() => this.form()().dirty());
    protected faCircleExclamation = faCircleExclamation;
    protected faToiletPaper = faToiletPaper;
}
