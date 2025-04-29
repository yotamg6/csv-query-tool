import { ChangeEvent } from 'react';

interface BaseField {
  label: string;
  value: string;
  placeholder: string;
  id: string;
}

export interface InputField extends BaseField {
  InputType: 'input';
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface TextAreaField extends BaseField {
  InputType: 'textArea';
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export type FormField = InputField | TextAreaField;
