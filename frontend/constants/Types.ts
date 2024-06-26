export type User = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  date_of_birth: string;
  created_at: string;
  is_verified: boolean;
  verified_at: string;
};

export type SignUpData = {
  first_name?: string | null | undefined;
  last_name?: string | null | undefined;
  username?: string | null | undefined;
  email?: string | null | undefined;
  password?: string | null | undefined;
  address?: string | null | undefined;
  date_of_birth?: string | null | undefined;
};

export type Event = {
  post_id: string;
  user_id: number;
  user_name: string;
  title: string;
  content: string;
  address: string;
  latitude: number;
  longitude: number;
  created_at: string;
  attendees: number[];
  deadline: string;
};

export type EventCreate = {
  title: string;
  content: string;
  address: string;
  deadline: string;
};
