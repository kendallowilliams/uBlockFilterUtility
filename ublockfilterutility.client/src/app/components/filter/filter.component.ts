import { Component, computed, input } from "@angular/core";
import { FilterModel } from "../../shared/models/filter.model";
import { faCircleExclamation, faToiletPaper } from "@fortawesome/free-solid-svg-icons";
import { FieldTree } from "@angular/forms/signals";

@Component({
    selector: 'app-filter',
    templateUrl: 'filter.component.html',
    standalone: false
})
export class FilterComponent {
    public form = input.required<FieldTree<FilterModel>>();
    public isFilterValid = input(true);

    protected isEdit = computed(() => this.form().Id().value() > 0);
    protected isDirty = computed(() => this.form()().dirty());
    protected faCircleExclamation = faCircleExclamation;
    protected faToiletPaper = faToiletPaper;
}
