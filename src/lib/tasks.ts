import { promises as fsPromises } from 'fs';

export interface Task {
  id: string;
  project: string;
  name: string;
  status: 'completed' | 'in_progress' | 'blocked' | 'failed' | 'pending' | 'not_started';
  assigned: string;
  notes: string;
}

export interface TaskBoard {
  projects: {
    name: string;
    tasks: Task[];
  }[];
  lastUpdated: string;
  summary: {
    completed: number;
    in_progress: number;
    blocked: number;
    failed: number;
    pending: number;
    not_started: number;
  };
}

export async function getTasks(): Promise<TaskBoard> {
  const taskBoardPath = process.env.TASK_BOARD_PATH || '/home/node/.openclaw/workspace/TASK-BOARD.md';
  const content = await fsPromises.readFile(taskBoardPath, 'utf-8');

  const projects: TaskBoard['projects'] = [];
  let currentProject: TaskBoard['projects'][0] | null = null;

  const lines = content.split('\n');
  const summary = {
    completed: 0,
    in_progress: 0,
    blocked: 0,
    failed: 0,
    pending: 0,
    not_started: 0,
  };

  for (const line of lines) {
    const projectMatch = line.match(/^## Project (\d+): (.+)/);
    if (projectMatch) {
      if (currentProject) {
        projects.push(currentProject);
      }
      currentProject = {
        name: projectMatch[2].trim(),
        tasks: [],
      };
      continue;
    }

    const taskMatch = line.match(/^\| (.+) \| (.+) \| (.+) \| (.+) \|/);
    if (taskMatch && currentProject) {
      const task: Task = {
        id: `${currentProject.name}-${currentProject.tasks.length}`,
        project: currentProject.name,
        name: taskMatch[1].trim(),
        status: parseStatus(taskMatch[2]),
        assigned: taskMatch[3].trim(),
        notes: taskMatch[4].trim(),
      };
      currentProject.tasks.push(task);
      summary[task.status]++;
    }
  }

  if (currentProject) {
    projects.push(currentProject);
  }

  const updatedMatch = content.match(/\*\*Last updated: (.+)\*\*/);
  const lastUpdated = updatedMatch ? updatedMatch[1] : new Date().toISOString();

  return {
    projects,
    lastUpdated,
    summary,
  };
}

function parseStatus(status: string): Task['status'] {
  if (status.includes('completed') || status.includes('🟢')) return 'completed';
  if (status.includes('in_progress') || status.includes('🟡')) return 'in_progress';
  if (status.includes('blocked') || status.includes('🔴')) return 'blocked';
  if (status.includes('failed') || status.includes('❌')) return 'failed';
  if (status.includes('pending') || status.includes('⏸')) return 'pending';
  if (status.includes('not_started') || status.includes('🔵')) return 'not_started';
  return 'pending';
}
