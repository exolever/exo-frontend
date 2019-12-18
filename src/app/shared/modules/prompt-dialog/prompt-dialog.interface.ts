export interface TextAreaInterface {
  placeholder: string;
  isRequired?: boolean;
  maxRows?: number;
}
export interface PromptDataInterface {
  title: string;
  primaryButton: string;
  messages?: string[];
  extraHTML?: string | string[];
  secondaryButton?: string;
  textArea?: TextAreaInterface;
}
