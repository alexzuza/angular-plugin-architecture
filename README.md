# AngularPluginArchitecture

For **Angular 11** see [https://github.com/alexzuza/angular-plugin-architecture-with-module-federation](https://github.com/alexzuza/angular-plugin-architecture-with-module-federation)

Example of building AOT compiled Angular 7 plugin that can be consumed on client and server sides(SSR)

For Angular 8 see [cli8](https://github.com/alexzuza/angular-plugin-architecture/tree/cli8)  branch

## Setup

```
npm install
```

Building shared plugin

```
npm run build:shared
```

Building plugins

```
npm run build:plugin1
npm run build:plugin2
```

## Run

Dev mode

```
npm start
```

Server-side

```
npm run build:ssr
npm run serve:ssr
```

## License

MIT
