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
  points: number[];
  //we did a plur here because thats the name of the table
  profiles?: { username: string };
};

type EventInfoAndSubmissionType = {
  eventInfo: EventType;
  submissions: SubmissionType[];
};

type FileInfo = {
  url: string | null;
  type: "image" | "video" | null;
};

export type { EventType, SubmissionType, EventInfoAndSubmissionType };
