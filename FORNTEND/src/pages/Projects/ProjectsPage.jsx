import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectFilteredProjects,
  selectProjectFilter,
  setStatusFilter,
  setSearchQuery,
  addLocalProject,
  deleteLocalProject,
  updateProjectStatus,
} from '../../features/projects/projectSlice';
import { addToast } from '../../features/ui/uiSlice';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Badge from '../../components/common/Badge/Badge';
import Modal from '../../components/common/Modal/Modal';
import Input from '../../components/common/Input/Input';
import { Plus, Search, Trash2, Calendar, Users, Tag, CheckCircle } from 'lucide-react';
import { PROJECT_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

const statusTabs = ['ALL', 'Planning', 'In Progress', 'In Review', 'Completed'];

const ProjectsPage = () => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectFilteredProjects);
  const { status: currentStatus, search } = useAppSelector(selectProjectFilter);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Smart Automation');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('$50,000');
  const [lead, setLead] = useState('Nakul Talsaniya');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch(
      addLocalProject({
        title,
        category,
        description,
        status: PROJECT_STATUS.PLANNING,
        progress: 0,
        teamSize: 5,
        budget,
        lead,
        dueDate: '2026-12-01',
        tags: ['Hackathon', 'SIH', category.split(' ')[0]],
      })
    );

    dispatch(
      addToast({
        type: 'success',
        message: `Project "${title}" registered successfully!`,
      })
    );

    setTitle('');
    setDescription('');
    setIsModalOpen(false);
  };

  const handleDelete = (id, projTitle) => {
    if (window.confirm(`Are you sure you want to delete "${projTitle}"?`)) {
      dispatch(deleteLocalProject(id));
      dispatch(
        addToast({
          type: 'info',
          message: `Project deleted from workspace.`,
        })
      );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Actions */}
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
            Hackathon Projects Portfolio
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Tracking milestones, teams, and deliverables across all registered domains.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Register Project
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {statusTabs.map((tab) => {
            const isActive =
              (tab === 'ALL' && currentStatus === 'ALL') ||
              tab.toLowerCase() === currentStatus.toLowerCase();
            return (
              <button
                key={tab}
                onClick={() => dispatch(setStatusFilter(tab))}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  backgroundColor: isActive ? 'var(--primary-600)' : 'var(--bg-hover)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Live Search */}
        <div style={{ minWidth: '260px' }}>
          <Input
            placeholder="Search by name, tag, or domain..."
            icon={Search}
            value={search}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
            No projects found matching the current criteria.
          </p>
          <Button variant="secondary" size="sm" onClick={() => dispatch(setStatusFilter('ALL'))}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '20px',
          }}
        >
          {projects.map((project) => (
            <Card
              key={project.id}
              hoverable
              title={project.title}
              subtitle={project.category}
              headerAction={<Badge status={project.status} />}
              footer={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <Calendar size={14} />
                    <span>Due {formatDate(project.dueDate)}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {project.status !== PROJECT_STATUS.COMPLETED && (
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={CheckCircle}
                        title="Mark Project Complete"
                        onClick={() => {
                          dispatch(
                            updateProjectStatus({
                              id: project.id,
                              status: PROJECT_STATUS.COMPLETED,
                            })
                          );
                          dispatch(
                            addToast({
                              type: 'success',
                              message: `Project marked as Completed!`,
                            })
                          );
                        }}
                      />
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={Trash2}
                      onClick={() => handleDelete(project.id, project.title)}
                    />
                  </div>
                </div>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {project.description}
                </p>

                {/* Progress */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span>Completion</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{project.progress}%</span>
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
                        backgroundColor:
                          project.progress === 100
                            ? 'var(--status-success)'
                            : 'var(--primary-500)',
                        borderRadius: 'var(--radius-full)',
                      }}
                    />
                  </div>
                </div>

                {/* Meta details */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    paddingTop: '8px',
                    borderTop: '1px dashed var(--border-color)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={14} />
                    <span>Lead: {project.lead}</span>
                  </div>
                  <span>Team: {project.teamSize} members</span>
                </div>

                {/* Tags */}
                {project.tags && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.7rem',
                          backgroundColor: 'var(--bg-hover)',
                          color: 'var(--text-secondary)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Hackathon Project"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Save to Redux State
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Project Title"
            placeholder="e.g. AI-driven Drone Pipeline Inspection"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Domain / Track
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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

          <Input
            label="Project Lead"
            placeholder="Lead Developer / PM"
            value={lead}
            onChange={(e) => setLead(e.target.value)}
          />

          <Input
            label="Allocated Budget"
            placeholder="$50,000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Project Overview
            </label>
            <textarea
              rows={3}
              placeholder="Describe the solution architecture and deliverables..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

export default ProjectsPage;
