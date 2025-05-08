'use client';

import { useRouter } from 'next/navigation';

interface SortDropdownProps {
  currentSort: string;
  currentPage: number;
}

/**
 * Dropdown component for sorting listings
 * @param {SortDropdownProps} props - Component props
 * @param {string} props.currentSort - Currently active sort option
 * @param {number} props.currentPage - Current pagination page
 * @returns {React.ReactElement} Sorting dropdown UI
 */
export default function SortDropdown({ currentSort, currentPage }: SortDropdownProps) {
  const router = useRouter();

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/listing?page=${currentPage}&sort=${event.target.value}`);
  };

  return (
    <select value={currentSort} onChange={handleSortChange} className="border p-2 rounded">
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
      <option value="closingSoonest">Closing Soonest</option>
      <option value="closingLatest">Closing Latest</option>
    </select>
  );
}
