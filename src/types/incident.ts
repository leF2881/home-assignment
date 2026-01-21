export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type Category = 
  | 'Malware' 
  | 'Intrusion' 
  | 'Data Exfiltration' 
  | 'DDoS' 
  | 'Phishing' 
  | 'Unauthorized Access';

export type Status = 'OPEN' | 'RESOLVED' | 'ESCALATED';

export interface Incident {
  id: string;
  severity: Severity;
  category: Category;
  source: string;
  timestamp: string;
  status: Status;
  
  // Client-side fields
  optimisticUpdate?: boolean;
  error?: string;
}

export interface IncidentUpdate {
  status: Status;
}

export interface CreateTestIncident {
  severity: Severity;
  category: Category;
  source: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}