"use client"

import React from 'react';
import { Box, Input } from '@chakra-ui/react';

export interface CalendarProps {
  mode?: 'single' | 'multiple' | 'range';
  selected?: Date | Date[] | { from: Date; to: Date };
  onSelect?: (date: Date | Date[] | { from: Date; to: Date } | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  classNames?: any;
  showOutsideDays?: boolean;
  captionLayout?: string;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  mode = 'single',
  selected,
  onSelect,
  disabled,
  ...props
}: CalendarProps) {
  // For SSR compatibility, use a simple native date input
  // This can be enhanced with a proper date picker library that supports SSR
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value);
    if (onSelect && !isNaN(date.getTime())) {
      onSelect(date);
    }
  };

  const dateValue = selected instanceof Date ? 
    selected.toISOString().split('T')[0] : '';

  return (
    <Box className={className}>
      <Input
        type="date"
        value={dateValue}
        onChange={handleDateChange}
        variant="outline"
        size="md"
      />
    </Box>
  );
}

Calendar.displayName = "Calendar";

export { Calendar }; 
