type EventType = {
  id: number;
  created_at: Date;
  name: string;
  tasks: string[];
  end_date: Date;
  slug: string;
};

type SubmissionType = {
  id: number;
  submitted_at: Date;
  event_id: string;
  file_paths: string[];
  submitted_by: number;
  files?: FileInfo[];
};

type FileInfo = {
  url: string | null;
  type: "image" | "video" | null;
};

export type { EventType, SubmissionType };
