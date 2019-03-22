import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Plugin1Component } from './plugin1.component';
import { SharedModule } from 'shared';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [Plugin1Component],
  entryComponents: [Plugin1Component]
})
export class Plugin1Module {
  static entry = Plugin1Component;
}
