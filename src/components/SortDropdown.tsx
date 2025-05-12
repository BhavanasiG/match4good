'use client';

import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SortDropdownProps {
  currentSort: string;
  currentPage: number;
}

/**
 * Dropdown component for sorting listings
 * @param {SortDropdownProps} props - Component props
 * @param {string} props.currentSort - Currently active sort option
 * @param {number} props.currentPage - Current pagination page
 * @returns {Element} Sorting dropdown UI
 */
export default function SortDropdown({ currentSort, currentPage }: SortDropdownProps) {
  const router = useRouter();

  const handleSortChange = (value: string) => {
    router.push(`/listing?page=${currentPage}&sort=${value}`);
  };

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="recommended">Recommended</SelectItem>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="oldest">Oldest</SelectItem>
        <SelectItem value="closingSoonest">Closing Soonest</SelectItem>
        <SelectItem value="closingLatest">Closing Latest</SelectItem>
      </SelectContent>
    </Select>
  );
}
