export interface INavigationItem {
  id: string;
  label: string;
  url: string;
  children?: INavigationItem[];
}
