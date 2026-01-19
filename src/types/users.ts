export type User = {
  id: string;
  login: string;
  avatar_url: string;
  url: string;
  starred?: boolean;
  name?: string;
  bio?: string;
  followers?: number;
  following?: number;
  repos?: number;
};

export type UserDetails = {
  avatar_url: string;
  bio: null;
  blog: '';
  company: null;
  created_at: '2019-06-12T11:29:35Z';
  email: null;
  events_url: 'https://api.github.com/users/micmaubbylopez7/events{/privacy}';
  followers: 0;
  followers_url: 'https://api.github.com/users/micmaubbylopez7/followers';
  following: 0;
  following_url: 'https://api.github.com/users/micmaubbylopez7/following{/other_user}';
  gists_url: 'https://api.github.com/users/micmaubbylopez7/gists{/gist_id}';
  gravatar_id: '';
  hireable: null;
  html_url: 'https://github.com/micmaubbylopez7';
  id: 51746475;
  location: null;
  login: 'micmaubbylopez7';
  name: null;
  node_id: 'MDEyOk9yZ2FuaXphdGlvbjUxNzQ2NDc1';
  organizations_url: 'https://api.github.com/users/micmaubbylopez7/orgs';
  public_gists: 0;
  public_repos: 0;
  received_events_url: 'https://api.github.com/users/micmaubbylopez7/received_events';
  repos_url: 'https://api.github.com/users/micmaubbylopez7/repos';
  site_admin: false;
  starred_url: 'https://api.github.com/users/micmaubbylopez7/starred{/owner}{/repo}';
  subscriptions_url: 'https://api.github.com/users/micmaubbylopez7/subscriptions';
  twitter_username: null;
  type: 'Organization';
  updated_at: '2019-06-12T11:29:35Z';
  url: 'https://api.github.com/users/micmaubbylopez7';
  user_view_type: 'public';
};

export type SearchUsersResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: User[];
  page: number;
};
