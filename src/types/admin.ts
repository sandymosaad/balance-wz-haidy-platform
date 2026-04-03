export interface AdminSession {
  isAdmin: boolean;
  email?: string;
}

export interface DashboardStats {
  totalPlaylists: number;
  totalVideos: number;
  totalViews: number;
  publishedVideos: number;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  type: 'Video' | 'Playlist';
  isPublished: boolean;
  createdAt: Date;
}

export interface AdminListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'all' | 'published' | 'draft';
}
