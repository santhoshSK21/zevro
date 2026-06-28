export type ComponentType = 'hero' | 'product-grid' | 'text' | 'spacer';

export interface BuilderComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
}

export interface BuilderState {
  components: BuilderComponent[];
  selectedId: string | null;
}
