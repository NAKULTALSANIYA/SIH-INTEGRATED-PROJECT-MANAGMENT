import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskApi from '../../api/taskApi';
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants';

const sampleTasks = [
  {
    id: 'tsk-101',
    projectId: 'proj-1',
    projectTitle: 'Smart Urban Water Grid',
    title: 'Calibrate pressure sensor arrays for Sector 4 pipeline',
    description: 'Verify flow rates against telemetry gateway and calibrate voltage offsets.',
    status: TASK_STATUS.IN_PROGRESS,
    priority: TASK_PRIORITY.HIGH,
    assignee: 'Aman Verma',
    dueDate: '2026-09-18',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk-102',
    projectId: 'proj-1',
    projectTitle: 'Smart Urban Water Grid',
    title: 'Deploy MQTT broker cluster with TLS mutual auth',
    description: 'Set up Mosquitto or EMQX brokers in High Availability configuration.',
    status: TASK_STATUS.TODO,
    priority: TASK_PRIORITY.URGENT,
    assignee: 'Nakul Talsaniya',
    dueDate: '2026-09-20',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk-103',
    projectId: 'proj-2',
    projectTitle: 'Disaster Relief Logistics',
    title: 'Integrate OpenStreetMap offline tiles cache for disaster zones',
    description: 'Ensure first responders can view maps without cellular connectivity.',
    status: TASK_STATUS.REVIEW,
    priority: TASK_PRIORITY.HIGH,
    assignee: 'Priya Sharma',
    dueDate: '2026-09-16',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk-104',
    projectId: 'proj-3',
    projectTitle: 'AI Crop Disease Detection',
    title: 'Train MobileNetV3 model on blight dataset with 94%+ accuracy',
    description: 'Model optimization and export to ONNX runtime format for edge mobile deployment.',
    status: TASK_STATUS.DONE,
    priority: TASK_PRIORITY.MEDIUM,
    assignee: 'Rohan Joshi',
    dueDate: '2026-09-10',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk-105',
    projectId: 'proj-4',
    projectTitle: 'Blockchain Audit Trail',
    title: 'Implement smart contract event listeners for tender approvals',
    description: 'Listen to TenderCreated and MilestonePaid events to update off-chain dashboard cache.',
    status: TASK_STATUS.TODO,
    priority: TASK_PRIORITY.MEDIUM,
    assignee: 'Nakul Talsaniya',
    dueDate: '2026-09-25',
    createdAt: new Date().toISOString(),
  },
];

const initialState = {
  tasks: sampleTasks,
  selectedProjectId: 'ALL',
  statusFilter: 'ALL',
  isLoading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params, { rejectWithValue }) => {
    try {
      const response = await taskApi.getAll(params);
      return response;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch tasks');
    }
  }
);

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addLocalTask: (state, action) => {
      const newTask = {
        ...action.payload,
        id: 'tsk-' + Date.now(),
        createdAt: new Date().toISOString(),
      };
      state.tasks.unshift(newTask);
    },
    updateTaskStatus: (state, action) => {
      const { taskId, status } = action.payload;
      const task = state.tasks.find((t) => t.id === taskId);
      if (task) {
        task.status = status;
      }
    },
    deleteLocalTask: (state, action) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    setSelectedProjectFilter: (state, action) => {
      state.selectedProjectId = action.payload;
    },
    setTaskStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.tasks = action.payload;
        }
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addLocalTask,
  updateTaskStatus,
  deleteLocalTask,
  setSelectedProjectFilter,
  setTaskStatusFilter,
} = taskSlice.actions;

export const selectAllTasks = (state) => state.tasks.tasks;
export const selectTasksByStatus = (status) => (state) =>
  state.tasks.tasks.filter((t) => t.status === status);
export const selectFilteredTasks = (state) => {
  const { tasks, selectedProjectId, statusFilter } = state.tasks;
  return tasks.filter((t) => {
    const matchesProject =
      selectedProjectId === 'ALL' || t.projectId === selectedProjectId;
    const matchesStatus =
      statusFilter === 'ALL' || t.status === statusFilter;
    return matchesProject && matchesStatus;
  });
};

export default taskSlice.reducer;
