import { toast } from 'react-toastify';
import type { SearchUsersResponse, User } from '../types/users';

export class UsersApi {
  private getRateLimitInfo(response: Response): { message: string; resetAt?: number } | null {
    const remaining = response.headers.get('x-ratelimit-remaining');
    if (remaining !== '0') {
      return null;
    }

    const reset = response.headers.get('x-ratelimit-reset');
    const resetSeconds = reset ? Number(reset) : NaN;
    if (!Number.isFinite(resetSeconds)) {
      return { message: 'Rate limit reached. Please try again later.' };
    }

    const nowSeconds = Math.floor(Date.now() / 1000);
    const waitSeconds = Math.max(0, resetSeconds - nowSeconds);
    const waitMessage = this.formatWaitTime(waitSeconds);
    return { message: `Rate limit reached. Try again in ${waitMessage}.`, resetAt: resetSeconds };
  }

  private formatWaitTime(waitSeconds: number): string {
    if (waitSeconds <= 0) {
      return 'a moment';
    }

    const hours = Math.floor(waitSeconds / 3600);
    const minutes = Math.floor((waitSeconds % 3600) / 60);
    const seconds = waitSeconds % 60;
    const parts: string[] = [];

    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    if (minutes > 0 || hours > 0) {
      parts.push(`${minutes}m`);
    }
    parts.push(`${seconds}s`);

    return parts.join(' ');
  }

  async searchUsers(query: string, page: number = 1, size: number = 30): Promise<SearchUsersResponse> {
    const response = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(query)}&page=${page}&per_page=${size}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!response.ok) {
      const rateLimitInfo = this.getRateLimitInfo(response);
      if (rateLimitInfo) {
        toast.error(rateLimitInfo.message);
        throw new RateLimitError(rateLimitInfo.message, rateLimitInfo.resetAt);
      }

      toast.error('Failed to fetch users');
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    return data;
  }

  async getUserByHandle(handle: string): Promise<User> {
    const response = await fetch(`https://api.github.com/users/${handle}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!response.ok) {
      const rateLimitInfo = this.getRateLimitInfo(response);
      if (rateLimitInfo) {
        toast.error(rateLimitInfo.message);
        throw new RateLimitError(rateLimitInfo.message, rateLimitInfo.resetAt);
      }

      toast.error('Failed to fetch user');
      throw new Error('Failed to fetch user');
    }

    const data = await response.json();
    return data;
  }
}

export const usersApi = new UsersApi();

class RateLimitError extends Error {
  rateLimitResetAt?: number;

  constructor(message: string, resetAt?: number) {
    super(message);
    this.name = 'RateLimitError';
    this.rateLimitResetAt = resetAt;
  }
}
