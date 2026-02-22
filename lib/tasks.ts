import { promises as fsPromises } from 'fs';
import path from 'path';

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

  // Parse the task board
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
    // Parse projects
    const projectMatch = line.match(/^## Project (\d+): (.+)/);
    if (projectMatch) {
      if (currentProject) {
        projects.push(currentProject);
      }
      currentProject = {
        name: projectMatch[1].trim(),
        tasks: [],
      };
      continue;
    }

    // Parse tasks
    const taskMatch = line.match(/^\|\s+\| (.+) \| (.+) \| (.+) \| (.+) \|\|/);
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

  // Add last project
  if (currentProject) {
    projects.push(currentProject);
  }

  // Find last updated timestamp
  const updatedMatch = content.match(/\*\*Last updated: (.+)\*\*/);
  const lastUpdated = updatedMatch ? updatedMatch[1] : new Date().toISOString();

  return {
    projects,
    lastUpdated,
    summary,
  };
}

function parseStatus(status: string): Task['status'] {
  const statusMap: Record<string, Task['status']> = {
    '🟢': 'completed',
    '🟡': 'in_progress',
    '🔴': 'blocked',
    '❌': 'failed',
    '⏸': 'pending',
    '🔵': 'not_started',
  };

  // Also handle text-based status
  if (status.includes('completed')) return 'completed';
  if (status.includes('in_progress')) return 'in_progress';
  if (status.includes('blocked')) return 'blocked';
  if (status.includes('failed')) return 'failed';
  if (status.includes('pending')) return 'pending';
  if (status.includes('not_started')) return 'not_started';

  return statusMap[status] || 'pending';
}

export async function updateTaskStatus(
  taskId: string,
  newStatus: Task['status']
): Promise<boolean> {
  const taskBoardPath = process.env.TASK_BOARD_PATH || '/home/node/.openclaw/workspace/TASK-BOARD.md';
  const content = await fsPromises.readFile(taskBoardPath, 'utf-8');
  const lines = content.split('\n');

  // Find and update the task
  let updated = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(taskId)) {
      const currentStatus = parseStatus(lines[i]);
      if (currentStatus === newStatus) return false; // Already same status

      // Update status in the line
      lines[i] = lines[i].replace(
        currentStatus,
        STATUS_TO_EMOJI[newStatus]
      );
      updated = true;
      break;
    }
  }

  if (updated) {
    await fsPromises.writeFile(taskBoardPath, lines.join('\n'), 'utf-8');
  }

  return updated;
}

const STATUS_TO_EMOJI: Record<Task['status'], string> = {
  completed: '🟢',
  in_progress: '🟡',
  blocked: '🔴',
  failed: '❌',
  pending: '⏸',
  not_started: '🔵',
};
