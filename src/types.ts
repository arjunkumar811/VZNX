export type ID = string;

export type Task = {
  id: ID;
  name: string;
  complete: boolean;
  assigneeId?: ID;
  projectId: ID;
};

export type Project = {
  id: ID;
  name: string;
  status: "Not Started" | "In Progress" | "Completed";
};

export type Member = {
  id: ID;
  name: string;
};
