// Constants for virtualization
export const ITEM_HEIGHT = 120;
export const CONTAINER_HEIGHT = 600;
export const ITEMS_PER_PAGE = Math.ceil(CONTAINER_HEIGHT / ITEM_HEIGHT);

// Utility functions
export const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-success';
  if (score >= 70) return 'text-warning';
  return 'text-error';
};