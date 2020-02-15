import {
  Component,
  Injector,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver
} from '@angular/core';
import { PluginLoaderService } from './services/plugin-loader/plugin-loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('targetRef', { read: ViewContainerRef, static: true })
  vcRef: ViewContainerRef;

  constructor(
    private injector: Injector,
    private pluginLoader: PluginLoaderService,
    private cfr: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.loadPlugin('plugin1');
  }

  loadPlugin(pluginName: string) {
    this.pluginLoader.load(pluginName).then((moduleType: any) => {
      const entry = moduleType.entry;
      const componentFactory = this.cfr.resolveComponentFactory(entry);
      this.vcRef.createComponent(componentFactory, undefined, this.injector);
    });
  }
}
