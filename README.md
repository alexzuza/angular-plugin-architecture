# AngularPluginArchitecture

Example of building AOT compiled Angular plugin that can be consumed on client and server sides(SSR)

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
