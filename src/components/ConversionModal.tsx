import React, { useState } from 'react';
import { Lead, Opportunity } from '@/types';
import Button from '@/components/ui/custom-button';
import Input from '@/components/ui/custom-input';
import Select from '@/components/ui/custom-select';
import Card from '@/components/ui/custom-card';
import { X } from 'lucide-react';

interface ConversionModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onConvert: (lead: Lead, opportunityData: Omit<Opportunity, 'id' | 'createdAt' | 'leadId'>) => Promise<void>;
}

const ConversionModal: React.FC<ConversionModalProps> = ({
  lead,
  isOpen,
  onClose,
  onConvert,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    stage: 'prospecting' as Opportunity['stage'],
    amount: '',
    accountName: '',
    probability: '',
    expectedCloseDate: '',
    priority: 'medium' as NonNullable<Opportunity['priority']>,
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stageOptions = [
    { value: 'prospecting', label: 'Prospecting' },
    { value: 'qualification', label: 'Qualification' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
  ];

  React.useEffect(() => {
    if (lead && isOpen) {
      setFormData({
        name: `${lead.company} Opportunity`,
        stage: 'prospecting',
        amount: '',
        accountName: lead.company,
        probability: '',
        expectedCloseDate: '',
        priority: 'medium',
        description: '',
      });
      setError(null);
    }
  }, [lead, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lead || !formData.name.trim() || !formData.accountName.trim()) {
      setError('Name and account name are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const opportunityData = {
        name: formData.name.trim(),
        stage: formData.stage,
        amount: formData.amount ? parseFloat(formData.amount) : undefined,
        accountName: formData.accountName.trim(),
        probability: formData.probability ? Math.max(0, Math.min(100, parseInt(formData.probability))) : undefined,
        expectedCloseDate: formData.expectedCloseDate || undefined,
        priority: formData.priority,
        description: formData.description?.trim() || undefined,
        leadData: lead,
      };
      
      await onConvert(lead, opportunityData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert lead');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <Card className="relative w-full max-w-3xl z-10 max-h-[86vh] overflow-y-auto" shadow="xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Convert Lead to Opportunity
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="w-4 h-4"/>
          </button>
        </div>

        {/* Lead Info */}
        <div className="bg-muted rounded-lg p-4 mb-6">
          <h3 className="font-medium text-foreground mb-1">{lead.name}</h3>
          <p className="text-sm text-muted-foreground">{lead.company}</p>
          <p className="text-sm text-muted-foreground">{lead.email}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Opportunity Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter opportunity name"
            required
          />

          <Input
            label="Account Name"
            value={formData.accountName}
            onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
            placeholder="Enter account name"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Probability (%)"
              type="number"
              value={formData.probability}
              onChange={(e) => setFormData(prev => ({ ...prev, probability: e.target.value }))}
              placeholder="0-100"
              min="0"
              max="100"
            />
            <Input
              label="Expected Close Date"
              type="date"
              value={formData.expectedCloseDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
            />
            <Select
              label="Stage"
              options={stageOptions}
              value={formData.stage}
              onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value as Opportunity['stage'] }))}
            />
            <Select
              label="Priority"
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Opportunity['priority'] }))}
            />
          </div>
          

          <Input
            label="Amount (Optional)"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            placeholder="Enter expected amount"
            min="0"
            step="0.01"
          />

          <div>
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <textarea
              className="mt-1 w-full rounded-md border border-input-border bg-background px-3 py-2 text-sm"
              rows={3}
              placeholder="Notes or context for this opportunity"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {error && (
            <div className="text-sm text-error bg-error-light p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="success"
              loading={loading}
              disabled={loading}
              className="flex-1"
            >
              Create Opportunity
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ConversionModal;