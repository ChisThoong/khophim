declare module "he" {
    interface DecodeOptions {
      isAttributeValue?: boolean;
      strict?: boolean;
    }
  
    interface EncodeOptions {
      useNamedReferences?: boolean;
      decimal?: boolean;
      encodeEverything?: boolean;
      allowUnsafeSymbols?: boolean;
    }
  
    export function decode(text: string, options?: DecodeOptions): string;
    export function encode(text: string, options?: EncodeOptions): string;
  }
  