import { Component, Input } from '@angular/core';
import { Category } from 'src/app/shared/models/category.model';

@Component({
  selector: 'app-category-small',
  templateUrl: './category-small.component.html',
  styleUrls: ['./category-small.component.scss']
})
export class CategorySmallComponent {

  @Input() category: Category;
}
