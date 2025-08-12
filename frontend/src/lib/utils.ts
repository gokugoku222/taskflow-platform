// Utility functions
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-PT');
};

export const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString('pt-PT');
};

export const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// CSS class utility (simplified version)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
