import {
  Component,
  Injector,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { PluginLoaderService } from './services/plugin-loader/plugin-loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('targetRef', { read: ViewContainerRef }) vcRef: ViewContainerRef;

  constructor(
    private injector: Injector,
    private pluginLoader: PluginLoaderService
  ) {}

  ngOnInit() {
    this.loadPlugin('plugin1');
  }

  loadPlugin(pluginName: string) {
    this.pluginLoader.load(pluginName).then(moduleFactory => {
      const moduleRef = moduleFactory.create(this.injector);
      const entryComponent = (moduleFactory.moduleType as any).entry;
      const compFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(
        entryComponent
      );
      this.vcRef.createComponent(compFactory);
    });
  }
}
