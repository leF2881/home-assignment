import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  Chip,
} from '@heroui/react';
import { useURLSync } from '../useURLSync';
import { Severity, Status, Category } from '@/types/incident';
import { SortField, SortOrder } from '../filterSlice';

const SEVERITIES: Severity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const STATUSES: Status[] = ['OPEN', 'RESOLVED', 'ESCALATED'];
const CATEGORIES: Category[] = [
  'Malware',
  'Intrusion',
  'Data Exfiltration',
  'DDoS',
  'Phishing',
  'Unauthorized Access',
];

export default function FilterControls() {
  const {
    filters,
    setSeverities,
    setStatuses,
    setCategories,
    setSearchSource,
    setSortField,
    setSortOrder,
    resetFilters,
  } = useURLSync();

  const hasActiveFilters =
    filters.severities.length > 0 ||
    filters.statuses.length > 0 ||
    filters.categories.length > 0 ||
    filters.searchSource.length > 0 ||
    filters.sortField !== 'timestamp' ||
    filters.sortOrder !== 'desc';

  const handleSeverityToggle = (severity: Severity) => {
    if (filters.severities.includes(severity)) {
      setSeverities(filters.severities.filter((s) => s !== severity));
    } else {
      setSeverities([...filters.severities, severity]);
    }
  };

  const handleStatusToggle = (status: Status) => {
    if (filters.statuses.includes(status)) {
      setStatuses(filters.statuses.filter((s) => s !== status));
    } else {
      setStatuses([...filters.statuses, status]);
    }
  };

  const handleCategoryToggle = (category: Category) => {
    if (filters.categories.includes(category)) {
      setCategories(filters.categories.filter((c) => c !== category));
    } else {
      setCategories([...filters.categories, category]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search by Source IP */}
      <Input
        placeholder="Search by source IP..."
        value={filters.searchSource}
        onChange={(e) => setSearchSource(e.target.value)}
        size="sm"
        classNames={{
          base: 'max-w-full',
          input: 'text-sm',
          inputWrapper: 'bg-zinc-900 border-zinc-800',
        }}
        startContent={
          <svg
            className="w-4 h-4 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
      />

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Severity Filter */}
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              size="sm"
              className="bg-zinc-900 border-zinc-800"
            >
              Severity
              {filters.severities.length > 0 && (
                <Chip
                  size="sm"
                  variant="flat"
                  color="primary"
                  className="ml-2"
                >
                  {filters.severities.length}
                </Chip>
              )}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Severity filter"
            selectionMode="multiple"
            selectedKeys={new Set(filters.severities)}
            onSelectionChange={(keys) => {
              setSeverities(Array.from(keys) as Severity[]);
            }}
          >
            {SEVERITIES.map((severity) => (
              <DropdownItem key={severity}>{severity}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        {/* Status Filter */}
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              size="sm"
              className="bg-zinc-900 border-zinc-800"
            >
              Status
              {filters.statuses.length > 0 && (
                <Chip
                  size="sm"
                  variant="flat"
                  color="primary"
                  className="ml-2"
                >
                  {filters.statuses.length}
                </Chip>
              )}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Status filter"
            selectionMode="multiple"
            selectedKeys={new Set(filters.statuses)}
            onSelectionChange={(keys) => {
              setStatuses(Array.from(keys) as Status[]);
            }}
          >
            {STATUSES.map((status) => (
              <DropdownItem key={status}>{status}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        {/* Category Filter */}
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              size="sm"
              className="bg-zinc-900 border-zinc-800"
            >
              Category
              {filters.categories.length > 0 && (
                <Chip
                  size="sm"
                  variant="flat"
                  color="primary"
                  className="ml-2"
                >
                  {filters.categories.length}
                </Chip>
              )}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Category filter"
            selectionMode="multiple"
            selectedKeys={new Set(filters.categories)}
            onSelectionChange={(keys) => {
              setCategories(Array.from(keys) as Category[]);
            }}
          >
            {CATEGORIES.map((category) => (
              <DropdownItem key={category}>{category}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        {/* Sort Field */}
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              size="sm"
              className="bg-zinc-900 border-zinc-800"
            >
              Sort: {filters.sortField === 'timestamp' ? 'Time' : 'Severity'}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Sort field"
            selectedKeys={new Set([filters.sortField])}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as SortField;
              if (selected) setSortField(selected);
            }}
          >
            <DropdownItem key="timestamp">Time</DropdownItem>
            <DropdownItem key="severity">Severity</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/* Sort Order */}
        <Button
          variant="flat"
          size="sm"
          className="bg-zinc-900 border-zinc-800"
          onClick={() =>
            setSortOrder(filters.sortOrder === 'asc' ? 'desc' : 'asc')
          }
        >
          {filters.sortOrder === 'asc' ? (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
              Asc
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              Desc
            </>
          )}
        </Button>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <Button
            variant="flat"
            size="sm"
            color="danger"
            onClick={resetFilters}
          >
            Reset
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-500">Active filters:</span>
          {filters.severities.map((severity) => (
            <Chip
              key={severity}
              size="sm"
              variant="flat"
              color="primary"
              onClose={() => handleSeverityToggle(severity)}
            >
              {severity}
            </Chip>
          ))}
          {filters.statuses.map((status) => (
            <Chip
              key={status}
              size="sm"
              variant="flat"
              color="primary"
              onClose={() => handleStatusToggle(status)}
            >
              {status}
            </Chip>
          ))}
          {filters.categories.map((category) => (
            <Chip
              key={category}
              size="sm"
              variant="flat"
              color="primary"
              onClose={() => handleCategoryToggle(category)}
            >
              {category}
            </Chip>
          ))}
          {filters.searchSource && (
            <Chip
              size="sm"
              variant="flat"
              color="primary"
              onClose={() => setSearchSource('')}
            >
              Source: {filters.searchSource}
            </Chip>
          )}
        </div>
      )}
    </div>
  );
}
