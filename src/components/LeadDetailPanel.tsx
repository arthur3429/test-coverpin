import React, { useState } from 'react';
import { Lead } from '@/types';
import SlideOver from '@/components/ui/custom-slide-over';
import Button from '@/components/ui/custom-button';
import Input from '@/components/ui/custom-input';
import Select from '@/components/ui/custom-select';
import Card from '@/components/ui/custom-card';

import StatusBadge from './ui/status-badge';
import { getScoreColor } from './virtualized-leads/leads-utils';

interface LeadDetailPanelProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (leadId: string, updates: Partial<Lead>) => Promise<void>;
  onConvert: (lead: Lead) => void;
}

const LeadDetailPanel: React.FC<LeadDetailPanelProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdate,
  onConvert,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Lead>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'unqualified', label: 'Unqualified' },
  ];

  if (!lead) return null;

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      status: lead.status,
      email: lead.email,
    });
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
    setError(null);
  };

  const handleSave = async () => {
    if (!editData.email || !editData.status) {
      setError('Status and email are required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await onUpdate(lead.id, editData);
      setIsEditing(false);
      setEditData({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lead');
    } finally {
      setLoading(false);
    }
  };


  const canConvert = lead.status === 'qualified';

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Lead Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header Info */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground">{lead.name}</h3>
              <p className="text-muted-foreground">{lead.company}</p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                {lead.score}
              </div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <StatusBadge status={lead.status} />
          </div>
        </Card>

        {/* Contact Information */}
        <Card>
          <h4 className="text-lg font-medium mb-4">Contact Information</h4>
          
          {isEditing ? (
            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={editData.email || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
              
              <Select
                label="Status"
                options={statusOptions}
                value={editData.status || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value as Lead['status'] }))}
              />
              
              {error && (
                <div className="text-sm text-error bg-error-light p-3 rounded-lg">
                  {error}
                </div>
              )}
              
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  loading={loading}
                  disabled={loading}
                >
                  Save Changes
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-foreground">{lead.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <StatusBadge status={lead.status} />
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                disabled={lead.status === 'converted'}
              >
                Edit Details
              </Button>
            </div>
          )}
        </Card>

        {/* Lead Information */}
        <Card>
          <h4 className="text-lg font-medium mb-4">Lead Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Company</label>
              <p className="text-foreground">{lead.company}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Source</label>
              <p className="text-foreground capitalize">{lead.source.replace('_', ' ')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Lead ID</label>
              <p className="text-foreground font-mono text-sm">{lead.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Score</label>
              <p className={`font-semibold ${getScoreColor(lead.score)}`}>{lead.score}</p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        {lead.status !== 'converted' && (
          <Card>
            <h4 className="text-lg font-medium mb-4">Actions</h4>
            <div className="space-y-3">
              {canConvert ? (
                <div>
                  <Button
                    variant="success"
                    onClick={() => onConvert(lead)}
                    className="w-full"
                  >
                    Convert to Opportunity
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    This lead is qualified and ready to be converted to an opportunity.
                  </p>
                </div>
              ) : (
                <div>
                  <Button
                    variant="secondary"
                    disabled
                    className="w-full"
                  >
                    Convert to Opportunity
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Lead must be qualified before conversion.
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </SlideOver>
  );
};

export default LeadDetailPanel;