import { LayoutGrid, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewSwitcherProps {
  view: 'table' | 'grid';
  onViewChange: (view: 'table' | 'grid') => void;
}

export function ViewSwitcher({ view, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="inline-flex items-center gap-1 border rounded-md p-1">
      <Button
        variant={view === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('table')}
        className="gap-2"
      >
        <Table className="h-4 w-4" />
        <span className="hidden sm:inline">Table</span>
      </Button>
      <Button
        variant={view === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className="gap-2"
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline">Grid</span>
      </Button>
    </div>
  );
}
