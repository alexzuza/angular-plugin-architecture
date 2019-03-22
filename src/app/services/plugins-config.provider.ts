import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { preserveServerState } from './transfer-state.service';
import { isPlatformBrowser } from '@angular/common';

interface PluginsConfig {
  [key: string]: {
    name: string;
    path: string;
    deps: string[];
  };
}

@Injectable()
export class PluginsConfigProvider {
  config: PluginsConfig;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: {},
    @Inject('APP_BASE_URL') @Optional() private readonly baseUrl: string
  ) {
    if (isPlatformBrowser(platformId)) {
      this.baseUrl = document.location.origin;
    }
  }

  @preserveServerState('PLUGIN_CONFIGS')
  loadConfig() {
    return this.http.get<PluginsConfig>(
      `${this.baseUrl}/assets/plugins-config.json`
    );
  }
}
