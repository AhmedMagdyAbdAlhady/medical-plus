export interface BreadcrumbItem {
  label: string;
  href?: string;
}
    
export interface BreadcrumbsProps {
  items: BreadcrumbItem[]; // Or 'BreadcrumbItem' if that's the name you chose
}