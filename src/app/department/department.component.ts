import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Department } from '../department';
import { DepartmentService } from '../department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  depName: string = '';
  departments: Department[] = [];
  depEdit: Department = null;

  private unsubscribe$: Subject<any> = new Subject();

  constructor(private departmentService: DepartmentService) { }

  ngOnInit() {
    this.departmentService.get()
      .pipe(takeUntil(this.unsubscribe$))
    .subscribe((deps)=>this.departments=deps)
  }

}
