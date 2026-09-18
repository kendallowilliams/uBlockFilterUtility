import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faEye, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FilterParameter } from '../../../shared/models/param.model';

@Component({
  selector: 'app-filter-parameter',
  standalone: false,
  templateUrl: './filter-parameter.component.html',
})
export class FilterParameterComponent {
  @Input() public param: FilterParameter | null = null;

  @Output() public paramEdit = new EventEmitter();
  @Output() public paramRemove = new EventEmitter();

  protected faTrash = faTrash;
  protected faEye = faEye;
  protected faPencil = faPencil;

  protected handlePreview(): void {
    const message = `Key: ${this.param?.key}\r\nValue: ${this.param?.value}`;
    alert(message);
  }

  protected handleEdit(): void {
    this.paramEdit.emit();
  }

  protected handleRemove(): void {
    this.paramRemove.emit();
  }
}
