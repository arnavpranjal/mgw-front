import { useEffect, useState, useCallback } from 'react';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { debounce } from 'lodash'; // Assuming lodash is available in your project

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
  const [initialized, setInitialized] = useState(false);

  // Debounced function to save column visibility states
  const debouncedSaveColumnVisibility = useCallback(debounce(() => {
    const visibilityStates = table.getAllColumns().map(column => ({
      id: column.id,
      isVisible: column.getIsVisible(),
    }));
    console.log('Saving column visibility:', visibilityStates);
    localStorage.setItem('columnVisibility', JSON.stringify(visibilityStates));
  }, 300), [table]); // Debounce by 300ms

  useEffect(() => {
    const savedVisibility = localStorage.getItem('columnVisibility');
    if (savedVisibility) {
      try {
        const visibilityStates = JSON.parse(savedVisibility);
        if (Array.isArray(visibilityStates)) {
          visibilityStates.forEach((savedColumn: { id: string; isVisible: boolean }) => {
            const column = table.getColumn(savedColumn.id);
            if (column) {
              console.log(`Restoring visibility for column ${column.id}: ${savedColumn.isVisible}`);
              column.toggleVisibility(savedColumn.isVisible);
            }
          });
          setInitialized(true);
        }
      } catch (error) {
        console.error("Error parsing column visibility from localStorage:", error);
      }
    } else {
      // If there's no saved state, consider the component initialized to allow normal operation
      setInitialized(true);
    }
  }, [table]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {initialized && table.getAllColumns().filter(column => typeof column.accessorFn !== 'undefined' && column.getCanHide()).map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            className="capitalize"
            checked={column.getIsVisible()}
            onCheckedChange={(value) => {
              column.toggleVisibility(value);
              debouncedSaveColumnVisibility(); // Save after each change with debounce
            }}
          >
            {column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
