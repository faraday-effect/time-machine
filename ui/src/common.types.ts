export interface VSelectChoice<T> {
  text: string;
  value: T;
}

export type VSelectChoices<T> = VSelectChoice<T>[];
