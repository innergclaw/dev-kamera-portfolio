export type LibraryItem = {
  id: string;
  title: string;
  synopsis: string;
  meta: string;
  thumbnail: string;
  video: string;
  progress?: number;
  rank?: number;
  badge?: "ORIGINAL" | "NEW";
};

const baseItems: LibraryItem[] = [
  { id: "best-work", title: "My Best Work", synopsis: "The projects I’m most proud of, from first frame to final cut.", meta: "Film 01 · 8 Minutes", thumbnail: "thumbnails/my-best-work.jpg", video: "videos/my-best-work.mp4", progress: 68, badge: "ORIGINAL" },
  { id: "behind-scenes", title: "Behind the Scenes", synopsis: "How it actually gets made, with the rough edges left in.", meta: "Series 01 · 6 Episodes", thumbnail: "thumbnails/behind-scenes.jpg", video: "videos/behind-scenes.mp4", progress: 36, badge: "NEW" },
  { id: "client-projects", title: "Client Projects", synopsis: "Real work for real people, shaped around a clear brief.", meta: "Collection · 12 Projects", thumbnail: "thumbnails/client-projects.jpg", video: "videos/client-projects.mp4", progress: 82, badge: "ORIGINAL" },
  { id: "featured-series", title: "Featured Series", synopsis: "The ongoing thing I keep building, one release at a time.", meta: "Season 1 · 12 Episodes", thumbnail: "thumbnails/featured-series.jpg", video: "videos/featured-series.mp4", progress: 21, badge: "NEW" },
  { id: "case-studies", title: "Case Studies", synopsis: "What happened, what worked, and what I’d do again.", meta: "Season 1 · 5 Episodes", thumbnail: "thumbnails/case-studies.jpg", video: "videos/case-studies.mp4", badge: "ORIGINAL" },
  { id: "quick-wins", title: "Quick Wins", synopsis: "Small projects, fast turnarounds, useful lessons.", meta: "Collection · 9 Shorts", thumbnail: "thumbnails/quick-wins.jpg", video: "videos/quick-wins.mp4", badge: "NEW" },
];

export const library = {
  continueWatching: [baseItems[0], baseItems[1], baseItems[2], baseItems[3]],
  originals: [baseItems[0], baseItems[1], baseItems[2], baseItems[3], baseItems[4]],
  topTen: [{ ...baseItems[2], rank: 1 }, { ...baseItems[4], rank: 2 }, { ...baseItems[0], rank: 3 }, { ...baseItems[5], rank: 4 }],
  newReleases: [baseItems[5], baseItems[3], baseItems[1], baseItems[4]],
};

export const hero = {
  title: "Exclusive Shots",
  meta: "Season 1 · 6 Episodes · Built in public",
  synopsis: "A working archive of the ideas, systems, and visual stories behind the work. Start with the process, stay for the finished frame.",
  video: "videos/hero.mp4",
};
