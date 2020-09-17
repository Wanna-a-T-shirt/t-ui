import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-component-info',
  templateUrl: './component-info.component.html',
  styleUrls: ['./component-info.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ComponentInfoComponent implements OnInit, OnChanges {
  @Input() isShow: boolean;
  @Output() isShowChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() componentName: string;

  details: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getDails();
  }

  ngOnChanges(changes: SimpleChanges) {
    let isShowChange = changes['isShow'];
    if (isShowChange?.currentValue) {
      this.getDails();
    }
  }

  private getDails(): void {
    this.http.get('../../assets/details.json').subscribe(res => {
       Object.keys(res).filter(key => {
        if (key === this.componentName) { 
          this.details =  res[key]; 
          return;
        } 
      })
    });
  }

  closeScreen() {
    this.isShowChange.emit(false);
  }
}
