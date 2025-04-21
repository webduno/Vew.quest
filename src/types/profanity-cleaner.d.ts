declare module 'profanity-cleaner' {
  interface CleanOptions {
    placeholder?: string;
    customReplacement?: (word: string) => string;
    keepFirstAndLastChar?: boolean;
    customMatch?: (word: string) => boolean;
    exceptions?: string[];
    customBadWords?: string[];
  }

  export function clean(text: string, options?: CleanOptions): string;
} 