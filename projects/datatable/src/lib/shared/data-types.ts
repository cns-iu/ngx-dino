export interface Text {
  type: 'text';
  content: string;
}

export interface Link {
  type: 'link';
  href: string;
  content: string;
}

export type DataType = Text | Link;
