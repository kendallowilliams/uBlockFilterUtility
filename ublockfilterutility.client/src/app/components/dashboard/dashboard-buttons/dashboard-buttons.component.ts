import { Component, input, output } from '@angular/core';
import { faFileExport, faPlus, faRotate, faScroll } from '@fortawesome/free-solid-svg-icons';
import { FilterService } from '../../../shared/services/filter.service';

@Component({
    selector: 'app-dashboard-buttons',
    templateUrl: 'dashboard-buttons.component.html',
    standalone: false
})
export class DashboardButtonsComponent {
    public disabled = input(false);
    public filterAdd = output();
    public scriptletEdit = output();

    protected faPlus = faPlus;
    protected faFileExport = faFileExport;
    protected faRotate = faRotate;
    protected faScroll = faScroll;
    protected readonly exportUrl?: string;
    protected updateListsUrl?: string;

    constructor(private filterService: FilterService) {
        this.exportUrl = this.filterService.getExportUrl();
        this.filterService.getAppConfig()
            .subscribe(config => this.updateListsUrl = config.UpdateListsUrl);
    }

    protected handleAddFilter(): void {
        this.filterAdd.emit();
    }

    protected handleEditScriptlet(): void {
        this.scriptletEdit.emit();
    }
}
