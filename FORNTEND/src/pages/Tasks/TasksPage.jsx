import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectFilteredTasks,
  addLocalTask,
  updateTaskStatus,
  deleteLocalTask,
  setSelectedProjectFilter,
} from '../../features/tasks/taskSlice';
import { selectAllProjects } from '../../features/projects/projectSlice';
import { addToast } from '../../features/ui/uiSlice';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Badge from '../../components/common/Badge/Badge';
import Modal from '../../components/common/Modal/Modal';
import Input from '../../components/common/Input/Input';
import { Plus, Trash2, ArrowRight, ArrowLeft, CheckCircle, Calendar, User } from 'lucide-react';
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

const columns = [
  { id: TASK_STATUS.TODO, title: 'To Do', color: 'var(--text-secondary)' },
  { id: TASK_STATUS.IN_PROGRESS, title: 'In Progress', color: 'var(--primary-500)' },
  { id: TASK_STATUS.REVIEW, title: 'In Review', color: 'var(--accent-amber)' },
  { id: TASK_STATUS.DONE, title: 'Done', color: 'var(--status-success)' },
];

const TasksPage = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectFilteredTasks);
  const projects = useAppSelector(selectAllProjects);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState(TASK_PRIORITY.HIGH);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || 'proj-1');
  const [assignee, setAssignee] = useState('Nakul Talsaniya');

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const project = projects.find((p) => p.id === selectedProjectId);

    dispatch(
      addLocalTask({
        title: taskTitle,
        description: taskDesc || 'Sprint task deliverable.',
        status: TASK_STATUS.TODO,
        priority: taskPriority,
        projectId: selectedProjectId,
        projectTitle: project?.title || 'General',
        assignee,
        dueDate: '2026-09-30',
      })
    );

    dispatch(
      addToast({
        type: 'success',
        message: `Task added to board!`,
      })
    );

    setTaskTitle('');
    setTaskDesc('');
    setIsModalOpen(false);
  };

  const getNextStatus = (current) => {
    if (current === TASK_STATUS.TODO) return TASK_STATUS.IN_PROGRESS;
    if (current === TASK_STATUS.IN_PROGRESS) return TASK_STATUS.REVIEW;
    if (current === TASK_STATUS.REVIEW) return TASK_STATUS.DONE;
    return null;
  };

  const getPrevStatus = (current) => {
    if (current === TASK_STATUS.DONE) return TASK_STATUS.REVIEW;
    if (current === TASK_STATUS.REVIEW) return TASK_STATUS.IN_PROGRESS;
    if (current === TASK_STATUS.IN_PROGRESS) return TASK_STATUS.TODO;
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Sprint Kanban Board
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Interactive task flow management powered by Redux Toolkit store.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            onChange={(e) => dispatch(setSelectedProjectFilter(e.target.value))}
            style={{
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 14px',
              fontSize: '0.84rem',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          >
            <option value="ALL">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>

          <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
            Add Task
          </Button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        {columns.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                minHeight: '480px',
                backgroundColor: 'var(--bg-card)',
              }}
            >
              {/* Column Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '10px',
                  borderBottom: '2px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: col.color,
                    }}
                  />
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {col.title}
                  </h3>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-hover)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {columnTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {columnTasks.length === 0 ? (
                  <div
                    style={{
                      padding: '30px 10px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '0.8125rem',
                      fontStyle: 'italic',
                    }}
                  >
                    No tasks in this lane
                  </div>
                ) : (
                  columnTasks.map((task) => {
                    const next = getNextStatus(task.status);
                    const prev = getPrevStatus(task.status);

                    return (
                      <div
                        key={task.id}
                        className="glass-panel"
                        style={{
                          padding: '14px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              color: 'var(--primary-400)',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                            }}
                          >
                            {task.projectTitle}
                          </span>
                          <Badge
                            variant={
                              task.priority === TASK_PRIORITY.URGENT
                                ? 'error'
                                : task.priority === TASK_PRIORITY.HIGH
                                ? 'warning'
                                : 'info'
                            }
                          >
                            {task.priority}
                          </Badge>
                        </div>

                        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.35 }}>
                          {task.title}
                        </h4>

                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                          {task.description}
                        </p>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.72rem',
                            color: 'var(--text-muted)',
                            paddingTop: '6px',
                            borderTop: '1px dashed var(--border-color)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <User size={12} />
                            <span>{task.assignee}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} />
                            <span>{formatDate(task.dueDate)}</span>
                          </div>
                        </div>

                        {/* Transitions */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {prev && (
                              <Button
                                size="sm"
                                variant="ghost"
                                icon={ArrowLeft}
                                title={`Move to ${prev}`}
                                onClick={() => {
                                  dispatch(updateTaskStatus({ taskId: task.id, status: prev }));
                                }}
                              />
                            )}
                            {next && (
                              <Button
                                size="sm"
                                variant="secondary"
                                icon={ArrowRight}
                                title={`Move to ${next}`}
                                onClick={() => {
                                  dispatch(updateTaskStatus({ taskId: task.id, status: next }));
                                }}
                              >
                                Advance
                              </Button>
                            )}
                          </div>

                          <Button
                            size="sm"
                            variant="ghost"
                            icon={Trash2}
                            onClick={() => {
                              dispatch(deleteLocalTask(task.id));
                              dispatch(addToast({ type: 'info', message: 'Task removed' }));
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Sprint Task"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateTask}>
              Create Task
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Task Title"
            placeholder="e.g. Integrate MQTT sensor stream with frontend chart"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Assigned Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
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
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Priority
              </label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
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
                <option value={TASK_PRIORITY.LOW}>Low</option>
                <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
                <option value={TASK_PRIORITY.HIGH}>High</option>
                <option value={TASK_PRIORITY.URGENT}>Urgent</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <Input
                label="Assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Task Description
            </label>
            <textarea
              rows={3}
              placeholder="Technical specifications or acceptance criteria..."
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
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

export default TasksPage;
