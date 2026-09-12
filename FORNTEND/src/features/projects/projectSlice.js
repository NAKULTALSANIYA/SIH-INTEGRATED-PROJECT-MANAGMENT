import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectApi from '../../api/projectApi';
import { PROJECT_STATUS } from '../../utils/constants';

const sampleProjects = [
  {
    id: 'proj-1',
    title: 'Smart Urban Water Grid & Leakage Detector',
    description: 'IoT and AI-powered telemetry system for municipal water conservation and pressure management across urban sectors.',
    status: PROJECT_STATUS.IN_PROGRESS,
    category: 'Smart Water & Sanitation',
    progress: 68,
    teamSize: 6,
    budget: '$45,000',
    dueDate: '2026-11-15',
    lead: 'Nakul Talsaniya',
    tags: ['IoT', 'ML', 'Node.js', 'ESP32'],
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'proj-2',
    title: 'Integrated Disaster Relief Logistics Portal',
    description: 'Real-time resource coordination, route clearance telemetry, and volunteer routing platform for NDRF emergency response.',
    status: PROJECT_STATUS.PLANNING,
    category: 'Disaster Management',
    progress: 25,
    teamSize: 8,
    budget: '$80,000',
    dueDate: '2026-12-30',
    lead: 'Priya Sharma',
    tags: ['GIS', 'React', 'WebSockets', 'Go'],
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'proj-3',
    title: 'AI Crop Disease Detection & Advisory System',
    description: 'Computer vision pipeline for multispectral drone photography helping smallholder farmers identify blight in early stages.',
    status: PROJECT_STATUS.COMPLETED,
    category: 'Agriculture & Rural Dev',
    progress: 100,
    teamSize: 4,
    budget: '$30,000',
    dueDate: '2026-08-20',
    lead: 'Aman Verma',
    tags: ['PyTorch', 'FastAPI', 'Mobile', 'Edge AI'],
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'proj-4',
    title: 'Blockchain Public Procurement Audit Trail',
    description: 'Zero-knowledge verification system ensuring transparent government e-tenders and milestone-based vendor payouts.',
    status: PROJECT_STATUS.REVIEW,
    category: 'GovTech & Fintech',
    progress: 88,
    teamSize: 5,
    budget: '$62,000',
    dueDate: '2026-10-05',
    lead: 'Rohan Joshi',
    tags: ['Solidity', 'Express', 'React', 'Hyperledger'],
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

const initialState = {
  projects: sampleProjects,
  activeProject: sampleProjects[0],
  statusFilter: 'ALL',
  searchQuery: '',
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await projectApi.getAll(params);
      return response;
    } catch (err) {
      // Return sample data if backend endpoint is not yet connected
      return rejectWithValue(err.message || 'Failed to fetch projects');
    }
  }
);

export const createProjectThunk = createAsyncThunk(
  'projects/create',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await projectApi.create(projectData);
      return response;
    } catch (err) {
      // Local fallback for seamless development experience
      const newProj = {
        ...projectData,
        id: 'proj-' + (Date.now()),
        progress: 0,
        teamSize: projectData.teamSize || 1,
        updatedAt: new Date().toISOString(),
      };
      return newProj;
    }
  }
);

export const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setActiveProject: (state, action) => {
      state.activeProject =
        state.projects.find((p) => p.id === action.payload) || null;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    addLocalProject: (state, action) => {
      const newProject = {
        ...action.payload,
        id: 'proj-' + Date.now(),
        progress: action.payload.progress || 0,
        teamSize: action.payload.teamSize || 1,
        updatedAt: new Date().toISOString(),
      };
      state.projects.unshift(newProject);
      state.activeProject = newProject;
    },
    deleteLocalProject: (state, action) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
      if (state.activeProject?.id === action.payload) {
        state.activeProject = state.projects[0] || null;
      }
    },
    updateProjectStatus: (state, action) => {
      const { id, status } = action.payload;
      const project = state.projects.find((p) => p.id === id);
      if (project) {
        project.status = status;
        project.updatedAt = new Date().toISOString();
        if (status === PROJECT_STATUS.COMPLETED) {
          project.progress = 100;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.projects = action.payload;
        }
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createProjectThunk.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
        state.activeProject = action.payload;
      });
  },
});

export const {
  setActiveProject,
  setStatusFilter,
  setSearchQuery,
  addLocalProject,
  deleteLocalProject,
  updateProjectStatus,
} = projectSlice.actions;

export const selectAllProjects = (state) => state.projects.projects;
export const selectActiveProject = (state) => state.projects.activeProject;
export const selectProjectsLoading = (state) => state.projects.isLoading;
export const selectProjectFilter = (state) => ({
  status: state.projects.statusFilter,
  search: state.projects.searchQuery,
});

// Derived Filtered Projects Selector
export const selectFilteredProjects = (state) => {
  const { projects, statusFilter, searchQuery } = state.projects;
  return projects.filter((project) => {
    const matchesStatus =
      statusFilter === 'ALL' || project.status.toLowerCase() === statusFilter.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      project.title.toLowerCase().includes(query) ||
      project.category?.toLowerCase().includes(query) ||
      project.tags?.some((t) => t.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });
};

export default projectSlice.reducer;
