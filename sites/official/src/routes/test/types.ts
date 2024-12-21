

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
  