export type ComponentType = 
  | 'hero' 
  | 'product-grid' 
  | 'category-grid' 
  | 'editorial-banner' 
  | 'trust-bar' 
  | 'newsletter' 
  | 'text' 
  | 'spacer';

export interface BuilderComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
}

export interface BuilderState {
  components: BuilderComponent[];
  selectedId: string | null;
}
