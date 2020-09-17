import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-component-info',
  templateUrl: './component-info.component.html',
  styleUrls: ['./component-info.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ComponentInfoComponent implements OnInit {
  @Input() isShow: boolean;
  @Output() isShowChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }

  closeScreen() {
    this.isShowChange.emit(false);
  }
}
