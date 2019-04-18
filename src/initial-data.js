const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'task-1: --1', score: 1 },
    'task-2': { id: 'task-2', content: 'task-2: --2', score: 2 },
    'task-3': { id: 'task-3', content: 'task-3: --1', score: 1 },
    'task-4': { id: 'task-4', content: 'task-4: --2', score: 2 },
    'task-5': { id: 'task-5', content: 'task-5: --1', score: 1 },
    'task-6': { id: 'task-6', content: 'task-6: --2', score: 2 },
    'task-7': { id: 'task-7', content: 'task-7: --1', score: 1 },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To do',
      taskIds: ['task-1', 'task-2',],
    },
    'column-2': {
      id: 'column-2',
      title: 'In progress',
      taskIds: ['task-3','task-5', 'task-7'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: ['task-6'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

export default initialData;

