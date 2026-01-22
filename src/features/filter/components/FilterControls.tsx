import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  Chip,
} from "@heroui/react";
import { useURLSync } from "../useURLSync";
import { Severity, Status, Category } from "@/types/incident";
import { SortField } from "../filterSlice";

const SEVERITIES: Severity[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const STATUSES: Status[] = ["OPEN", "RESOLVED", "ESCALATED"];
const CATEGORIES: Category[] = [
  "Malware",
  "Intrusion",
  "Data Exfiltration",
  "DDoS",
  "Phishing",
  "Unauthorized Access",
];

export default function FilterControls() {
  const {
    filters,
    setSeverities,
    setStatuses,
    setCategories,
    setSearchSource,
    setSortField,
    resetFilters,
  } = useURLSync();

  const hasActiveFilters =
    filters.severities.length > 0 ||
    filters.statuses.length > 0 ||
    filters.categories.length > 0 ||
    filters.searchSource.length > 0;

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
      {/* Controls Row: Search + Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
        {/* Search by Source IP (moved next to filters) */}
        <Input
          placeholder="Search by source IP..."
          value={filters.searchSource}
          onChange={(e) => setSearchSource(e.target.value)}
          size="sm"
          className="w-full sm:w-72"
          classNames={{
            base: "max-w-full",
            input: "text-[13px] md:text-sm", // slightly bigger
            inputWrapper:
              "bg-zinc-900/80 border-zinc-700 hover:border-zinc-600 focus-within:border-zinc-500",
          }}
          startContent={
            <svg
              className="w-4 h-4 text-zinc-400"
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

        {/* Severity Filter */}
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              size="sm"
              className="bg-zinc-900/80 border border-zinc-700 text-[13px] md:text-sm"
            >
              Severity
              {filters.severities.length > 0 && (
                <Chip size="sm" variant="flat" color="primary" className="ml-2">
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
              className="bg-zinc-900/80 border border-zinc-700 text-[13px] md:text-sm"
            >
              Status
              {filters.statuses.length > 0 && (
                <Chip size="sm" variant="flat" color="primary" className="ml-2">
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
              className="bg-zinc-900/80 border border-zinc-700 text-[13px] md:text-sm"
            >
              Category
              {filters.categories.length > 0 && (
                <Chip size="sm" variant="flat" color="primary" className="ml-2">
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
              className={`
    bg-zinc-900/80 border border-zinc-700 text-[13px] md:text-sm
    ${filters.sortField !== "timestamp" }
  `}
            >
              Sort: {filters.sortField === "timestamp" ? "Time" : "Severity"}
              {filters.sortField !== "timestamp" && (
                <svg
                  className="ml-2 h-4 w-4 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4h13M3 10h9m-9 6h5"
                  />
                </svg>
              )}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Sort field"
            selectionMode="single"
            selectedKeys={new Set([filters.sortField])}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as SortField | undefined;
              if (selected) setSortField(selected);
            }}
          >
            <DropdownItem key="timestamp">Time</DropdownItem>
            <DropdownItem key="severity">Severity</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <Button
            variant="flat"
            size="sm"
            color="danger"
            onClick={resetFilters}
            className="text-[13px] md:text-sm"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
          <span className="text-xs md:text-sm text-zinc-400">
            Active filters:
          </span>

          {filters.severities.map((severity) => (
            <Chip
              key={severity}
              size="sm"
              variant="flat"
              color="primary"
              onClose={() => handleSeverityToggle(severity)}
              className="text-[12px] md:text-[13px]"
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
              className="text-[12px] md:text-[13px]"
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
              className="text-[12px] md:text-[13px]"
            >
              {category}
            </Chip>
          ))}
          {filters.searchSource && (
            <Chip
              size="sm"
              variant="flat"
              color="primary"
              onClose={() => setSearchSource("")}
              className="text-[12px] md:text-[13px]"
            >
              Source: {filters.searchSource}
            </Chip>
          )}
        </div>
      )}
    </div>
  );
}
