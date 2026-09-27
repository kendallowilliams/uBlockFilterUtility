import { Component, model, output } from '@angular/core';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FilterParameter } from '../../../shared/models/filter-parameter.model';

@Component({
  selector: 'app-filter-parameter',
  standalone: false,
  templateUrl: './filter-parameter.component.html',
})
export class FilterParameterComponent {
  public param = model.required<FilterParameter>();
  public disabled = model(false);

  public paramEdit = output();
  public paramRemove = output();

  protected faTrash = faTrash;
  protected faPencil = faPencil;

  protected handleEdit(): void {
    this.paramEdit.emit();
  }

  protected handleRemove(): void {
    this.paramRemove.emit();
  }
}
