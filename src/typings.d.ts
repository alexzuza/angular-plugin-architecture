interface Window {
  define: (name: string, deps: string[], definitionFn: () => any) => void;

  System: {
    import: (path) => Promise<any>;
  };
}
