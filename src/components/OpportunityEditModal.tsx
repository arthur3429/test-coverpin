import React, { useEffect, useState } from 'react';
import { Opportunity } from '@/types';
import Button from '@/components/ui/custom-button';
import Input from '@/components/ui/custom-input';
import Select from '@/components/ui/custom-select';
import Card from '@/components/ui/custom-card';
import { X } from 'lucide-react';

interface OpportunityEditModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Opportunity>) => Promise<void>;
}

const OpportunityEditModal: React.FC<OpportunityEditModalProps> = ({ opportunity, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    stage: 'prospecting' as Opportunity['stage'],
    amount: '',
    accountName: '',
    probability: '',
    expectedCloseDate: '',
    priority: 'medium' as NonNullable<Opportunity['priority']>,
    description: '',
    assignee: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stageOptions = [
    { value: 'prospecting', label: 'Prospecting' },
    { value: 'qualification', label: 'Qualification' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed_won', label: 'Closed Won' },
    { value: 'closed_lost', label: 'Closed Lost' },
  ];

  useEffect(() => {
    if (opportunity && isOpen) {
      setFormData({
        name: opportunity.name || '',
        stage: opportunity.stage || 'prospecting',
        amount: opportunity.amount != null ? String(opportunity.amount) : '',
        accountName: opportunity.accountName || '',
        probability: opportunity.probability != null ? String(opportunity.probability) : '',
        expectedCloseDate: opportunity.expectedCloseDate || '',
        priority: opportunity.priority || 'medium',
        description: opportunity.description || '',
        assignee: opportunity.assignee || '',
      });
      setError(null);
    }
  }, [opportunity, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opportunity) return;
    if (!formData.name.trim() || !formData.accountName.trim()) {
      setError('Name and account name are required');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const updates: Partial<Opportunity> = {
        name: formData.name.trim(),
        stage: formData.stage,
        amount: formData.amount ? parseFloat(formData.amount) : undefined,
        accountName: formData.accountName.trim(),
        probability: formData.probability ? Math.max(0, Math.min(100, parseInt(formData.probability))) : undefined,
        expectedCloseDate: formData.expectedCloseDate || undefined,
        priority: formData.priority,
        description: formData.description?.trim() || undefined,
        assignee: formData.assignee?.trim() || undefined,
      };
      await onSave(opportunity.id, updates);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update opportunity');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !opportunity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative w-full max-w-3xl z-10 max-h-[86vh] overflow-y-auto" shadow="xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Edit Opportunity</h2>
          <button onClick={onClose} className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Opportunity Name"
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            placeholder="Enter opportunity name"
            required
          />

          <Input
            label="Account Name"
            value={formData.accountName}
            onChange={(e) => setFormData((p) => ({ ...p, accountName: e.target.value }))}
            placeholder="Enter account name"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Probability (%)"
              type="number"
              value={formData.probability}
              onChange={(e) => setFormData((p) => ({ ...p, probability: e.target.value }))}
              placeholder="0-100"
              min="0"
              max="100"
            />
            <Input
              label="Expected Close Date"
              type="date"
              value={formData.expectedCloseDate}
              onChange={(e) => setFormData((p) => ({ ...p, expectedCloseDate: e.target.value }))}
            />
            <Select
              label="Stage"
              options={stageOptions}
              value={formData.stage}
              onChange={(e) => setFormData((p) => ({ ...p, stage: e.target.value as Opportunity['stage'] }))}
            />
            <Select
              label="Priority"
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
              value={formData.priority}
              onChange={(e) => setFormData((p) => ({ ...p, priority: e.target.value as Opportunity['priority'] }))}
            />
          </div>

          <Input
            label="Amount (Optional)"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData((p) => ({ ...p, amount: e.target.value }))}
            placeholder="Enter expected amount"
            min="0"
            step="0.01"
          />

          <Input
            label="Assignee (Optional)"
            value={formData.assignee}
            onChange={(e) => setFormData((p) => ({ ...p, assignee: e.target.value }))}
            placeholder="Enter assignee"
          />

          <div>
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <textarea
              className="mt-1 w-full rounded-md border border-input-border bg-background px-3 py-2 text-sm"
              rows={3}
              placeholder="Notes or context for this opportunity"
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          {error && (
            <div className="text-sm text-error bg-error-light p-3 rounded-lg">{error}</div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="success" loading={loading} disabled={loading} className="flex-1">
              Save Changes
            </Button>
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default OpportunityEditModal;
