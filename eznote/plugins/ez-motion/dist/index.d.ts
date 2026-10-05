export declare function EzMotion(): {
  name: string;
  textTransform: (html: string) => string;
  externalResources: () => {
    js: {
      loadTime: "beforeDOMReady" | "afterDOMReady";
      contentType: "inline" | "file";
      script: string;
    }[];
  };
};
export default EzMotion;
