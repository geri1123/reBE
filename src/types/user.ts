export interface UsernameHistoryRecord {
  id?: number;                
  user_id: number;
  old_username: string;
  new_username: string;
  next_username_update: Date;
}

export type UserForLogin = {
  id: number;
  username: string;
  email: string;
  password: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
};