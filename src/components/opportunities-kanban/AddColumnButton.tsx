import React, { useState } from 'react';
import Button from '@/components/ui/custom-button';

interface AddColumnButtonProps {
  onAdd: (title: string) => void;
}

export function AddColumnButton({ onAdd }: AddColumnButtonProps) {
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState('');

  if (!adding) {
    return (
      <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
        + Column
      </Button>
    );
  }

  const handleAdd = () => {
    if (value.trim()) {
      onAdd(value.trim());
    }
    setValue('');
    setAdding(false);
  };

  const handleCancel = () => {
    setAdding(false);
    setValue('');
  };

  return (
    <div className="flex items-center gap-2">
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-9 rounded-md border border-input-border bg-background px-3 text-sm"
        placeholder="Column title"
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAdd();
          if (e.key === 'Escape') handleCancel();
        }}
      />
      <Button size="sm" onClick={handleAdd}>
        Add
      </Button>
      <Button size="sm" variant="ghost" onClick={handleCancel}>
        Cancel
      </Button>
    </div>
  );
}