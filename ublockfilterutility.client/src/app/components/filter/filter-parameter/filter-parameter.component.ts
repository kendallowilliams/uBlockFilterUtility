import { Component, EventEmitter, model, Output } from '@angular/core';
import { faEye, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FilterParameter } from '../../../shared/models/filter-parameter.model';
import { MessageBoxService } from '../../../shared/services/message-box.service';

@Component({
  selector: 'app-filter-parameter',
  standalone: false,
  templateUrl: './filter-parameter.component.html',
})
export class FilterParameterComponent {
  public param = model.required<FilterParameter>();
  public disabled = model(false);

  @Output() public paramEdit = new EventEmitter();
  @Output() public paramRemove = new EventEmitter();

  protected faTrash = faTrash;
  protected faEye = faEye;
  protected faPencil = faPencil;

  constructor(private messageBoxService: MessageBoxService) {}

  protected handlePreview(): void {
    this.messageBoxService.alert({
        options: {
          class: 'modal-lg modal-dialog-centered',
          initialState: {
            context: {
              title: `"${this.param().key}" Preview`,
              message: this.param().value
            }
          }
        }
    });
  }

  protected handleEdit(): void {
    this.paramEdit.emit();
  }

  protected handleRemove(): void {
    this.paramRemove.emit();
  }
}
