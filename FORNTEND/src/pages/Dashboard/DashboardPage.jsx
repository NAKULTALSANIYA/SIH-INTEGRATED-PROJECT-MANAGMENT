import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAllProjects, addLocalProject } from '../../features/projects/projectSlice';
import { selectAllTasks, addLocalTask, updateTaskStatus } from '../../features/tasks/taskSlice';
import { addToast } from '../../features/ui/uiSlice';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Badge from '../../components/common/Badge/Badge';
import Modal from '../../components/common/Modal/Modal';
import Input from '../../components/common/Input/Input';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Sparkles,
  Layers,
} from 'lucide-react';
import { PROJECT_STATUS, TASK_STATUS, TASK_PRIORITY } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectAllProjects);
  const tasks = useAppSelector(selectAllTasks);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState('Smart Automation');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  // Derived Metrics
  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.status === PROJECT_STATUS.COMPLETED).length;
  const activeTasks = tasks.filter((t) => t.status !== TASK_STATUS.DONE).length;
  const completedTasks = tasks.filter((t) => t.status === TASK_STATUS.DONE).length;
  const overallProgress = totalProjects
    ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / totalProjects)
    : 0;

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    dispatch(
      addLocalProject({
        title: newProjectTitle,
        category: newProjectCategory,
        description: newProjectDesc || 'Created from SIH dashboard quick launcher.',
        status: PROJECT_STATUS.PLANNING,
        progress: 10,
        teamSize: 4,
        lead: 'Nakul Talsaniya',
        tags: ['SIH-2026', 'React', 'Redux'],
      })
    );

    dispatch(
      addToast({
        type: 'success',
        message: `Project "${newProjectTitle}" created successfully in Redux store!`,
      })
    );

    setNewProjectTitle('');
    setNewProjectDesc('');
    setIsProjectModalOpen(false);
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: totalProjects,
      change: '+2 this month',
      icon: FolderKanban,
      color: 'var(--primary-500)',
      bgColor: 'rgba(99, 102, 241, 0.1)',
    },
    {
      title: 'Active Tasks',
      value: activeTasks,
      change: `${tasks.length} total tasks`,
      icon: Clock,
      color: 'var(--accent-amber)',
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
    {
      title: 'Completed Tasks',
      value: completedTasks,
      change: `${Math.round((completedTasks / (tasks.length || 1)) * 100)}% completion rate`,
      icon: CheckCircle2,
      color: 'var(--status-success)',
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      title: 'Avg. Delivery Pace',
      value: `${overallProgress}%`,
      change: 'On schedule',
      icon: TrendingUp,
      color: 'var(--accent-cyan)',
      bgColor: 'rgba(6, 182, 212, 0.1)',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Welcome Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '28px 32px',
          background:
            'linear-gradient(135deg, rgba(79, 70, 229, 0.18) 0%, rgba(139, 92, 246, 0.12) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={20} color="var(--primary-400)" />
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--primary-400)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Smart India Hackathon Workspace
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Integrated Project Management Platform
          </h1>
          <p
            style={{
              fontSize: '0.9375rem',
              color: 'var(--text-secondary)',
              marginTop: '4px',
              maxWidth: '650px',
            }}
          >
            Manage telemetry, edge AI pipelines, hardware milestones, and team tasks with
            centralized Redux Toolkit architecture and Axios service layers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsProjectModalOpen(true)}
          >
            Create Project
          </Button>
          <Button
            variant="secondary"
            icon={Layers}
            onClick={() =>
              dispatch(
                addToast({
                  type: 'info',
                  message: 'API layer ready: Axios interceptors active with JWT token caching.',
                })
              )
            }
          >
            Test Redux & API
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
        }}
      >
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} hoverable style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {stat.title}
                  </span>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                    {stat.value}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
                    {stat.change}
                  </span>
                </div>
                <div
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: stat.bgColor,
                    color: stat.color,
                  }}
                >
                  <Icon size={24} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Projects Overview & Tasks Split */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Active Projects Preview */}
        <Card
          title="Active Projects Pipeline"
          subtitle="Real-time status of hackathon solutions"
          headerAction={
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowUpRight}
              onClick={() => window.location.assign('/projects')}
            >
              View All
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {projects.slice(0, 4).map((project) => (
              <div
                key={project.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-hover)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {project.title}
                  </h4>
                  <Badge status={project.status} />
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {project.description}
                </p>

                {/* Progress bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div
                    style={{
                      height: '6px',
                      backgroundColor: 'var(--bg-active)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${project.progress}%`,
                        backgroundColor: 'var(--primary-500)',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Priority Tasks */}
        <Card
          title="High Priority Deliverables"
          subtitle="Tasks assigned across active sprints"
          headerAction={
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowUpRight}
              onClick={() => window.location.assign('/tasks')}
            >
              Task Board
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-hover)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {task.title}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>{task.projectTitle}</span>
                    <span>•</span>
                    <span>Assignee: {task.assignee}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Badge variant={task.priority === TASK_PRIORITY.URGENT ? 'error' : 'warning'}>
                    {task.priority}
                  </Badge>
                  <Button
                    size="sm"
                    variant={task.status === TASK_STATUS.DONE ? 'secondary' : 'outline'}
                    onClick={() => {
                      const nextStatus =
                        task.status === TASK_STATUS.DONE ? TASK_STATUS.TODO : TASK_STATUS.DONE;
                      dispatch(updateTaskStatus({ taskId: task.id, status: nextStatus }));
                      dispatch(
                        addToast({
                          type: 'info',
                          message: `Task updated to ${nextStatus}`,
                        })
                      );
                    }}
                  >
                    {task.status === TASK_STATUS.DONE ? 'Completed' : 'Mark Done'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* New Project Modal */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Create New Hackathon Project"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsProjectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateProject}>
              Save Project
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Project Title"
            placeholder="e.g. AI Flood Prediction Sensor Grid"
            value={newProjectTitle}
            onChange={(e) => setNewProjectTitle(e.target.value)}
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Category / Domain
            </label>
            <select
              value={newProjectCategory}
              onChange={(e) => setNewProjectCategory(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            >
              <option value="Smart Automation">Smart Automation</option>
              <option value="Disaster Management">Disaster Management</option>
              <option value="Agriculture & Rural Dev">Agriculture & Rural Dev</option>
              <option value="Smart Water & Sanitation">Smart Water & Sanitation</option>
              <option value="GovTech & Cybersecurity">GovTech & Cybersecurity</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Description & Objectives
            </label>
            <textarea
              rows={3}
              placeholder="Brief summary of the architecture and goals..."
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardPage;
