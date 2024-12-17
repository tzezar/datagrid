import type { ColumnDef, ColumnId } from "./datagrid/core/helpers/column-creators";






export type Row<T> = {
  index: number;
  groupId: string | null;
  parentId: string | null;
  original: T;
  depth: number;
  isExpanded?: boolean;
  aggregates: {
    [columnId: string]: {
      sum?: number;
      count?: number;
      min?: number;
      max?: number;
      mean?: number;
    };
  };
  columnId: ColumnId;
}

export type Cell<T> = {
  id: string,
  getValue: () => any,
  renderValue: () => any,
  row: Row<T>,
  column: ColumnDef<T>,
  getContext<T>(): T
}


export interface User {
    id: number;
    firstName: string;
    lastName: string;
    profile: {
      age: number;
      email: string;
      country: string;
    };
    stats: {
      visits: number;
      lastLogin: Date;
      averageSessionDuration: number; // in minutes
    };
    status: 'active' | 'inactive' | 'pending';
    role: 'admin' | 'user' | 'guest';
  }
  