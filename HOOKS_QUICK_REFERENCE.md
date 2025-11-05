# Custom Hooks - Quick Reference Guide

This guide provides quick, copy-paste examples for all custom hooks in the system.

## Table of Contents
- [useFetch](#usefetch) - Data fetching
- [usePagination](#usepagination) - Pagination
- [useFilters](#usefilters) - Filtering
- [useDebounce](#usedebounce) - Debouncing
- [useAsync](#useasync) - Async operations
- [useLocalStorage](#uselocalstorage) - Browser storage

---

## useFetch

### Basic Usage - Fetch on Mount
```javascript
import { useFetch } from '@/lib/hooks';

function ItemsList() {
  const { data: items, loading, error, refetch } = useFetch('/api/items');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### With Auto-Refresh
```javascript
const { data, loading, error } = useFetch('/api/items', {
  refreshInterval: 30000, // Refresh every 30 seconds
});
```

### With Dependencies (Refetch when filters change)
```javascript
function FilteredItems({ category, status }) {
  const url = buildUrl('/api/items', { category, status });

  const { data, loading } = useFetch(url, {
    deps: [category, status], // Refetch when these change
  });

  return <ItemsList items={data} loading={loading} />;
}
```

### With Success/Error Callbacks
```javascript
const { data, loading } = useFetch('/api/items', {
  onSuccess: (data) => {
    toast.success(`Loaded ${data.length} items`);
  },
  onError: (error) => {
    console.error('Failed to load items:', error);
  },
});
```

### Lazy Fetch (Manual Trigger)
```javascript
import { useLazyFetch } from '@/lib/hooks';

function SearchComponent() {
  const { data, loading, fetch } = useLazyFetch();

  const handleSearch = async (query) => {
    await fetch(`/api/search?q=${query}`);
  };

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {loading && <Spinner />}
      {data && <Results data={data} />}
    </div>
  );
}
```

---

## usePagination

### Basic Pagination
```javascript
import { usePagination } from '@/lib/hooks';

function PaginatedList({ totalItems }) {
  const {
    page,
    pageSize,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
  } = usePagination({
    totalItems,
    initialPageSize: 20,
  });

  return (
    <div>
      <div>Page {page} of {totalPages}</div>
      <button onClick={prevPage} disabled={!hasPrevPage}>
        Previous
      </button>
      <button onClick={nextPage} disabled={!hasNextPage}>
        Next
      </button>
    </div>
  );
}
```

### Server-Side Pagination
```javascript
import { useServerPagination } from '@/lib/hooks';
import { buildUrl } from '@/lib/utils';

function ServerPaginatedList() {
  const { page, pageSize, queryParams, goToPage } = useServerPagination({
    initialPageSize: 20,
  });

  // Use queryParams in API call
  const url = buildUrl('/api/items', queryParams);
  const { data, loading } = useFetch(url);

  return (
    <div>
      {/* Show items */}
      <Pagination page={page} goToPage={goToPage} />
    </div>
  );
}
```

### Client-Side Pagination
```javascript
import { useClientPagination } from '@/lib/hooks';

function ClientPaginatedList({ allItems }) {
  const {
    currentPageData,
    page,
    totalPages,
    nextPage,
    prevPage,
  } = useClientPagination(allItems, {
    initialPageSize: 10,
  });

  return (
    <div>
      {currentPageData.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
      <div>
        <button onClick={prevPage}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={nextPage}>Next</button>
      </div>
    </div>
  );
}
```

---

## useFilters

### Basic Filters
```javascript
import { useFilters } from '@/lib/hooks';

function FilteredList() {
  const {
    filters,
    setFilter,
    clearFilter,
    clearAllFilters,
    hasActiveFilters,
  } = useFilters({
    status: '',
    category: '',
    location: '',
  });

  return (
    <div>
      <select
        value={filters.status}
        onChange={(e) => setFilter('status', e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="available">Available</option>
        <option value="assigned">Assigned</option>
      </select>

      {hasActiveFilters && (
        <button onClick={clearAllFilters}>Clear All Filters</button>
      )}
    </div>
  );
}
```

### Search with Filters
```javascript
import { useSearch } from '@/lib/hooks';

function SearchableFilteredList() {
  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    cleanAllFilters, // Returns only non-empty filters
    clearAll,
  } = useSearch({
    status: '',
    category: '',
  });

  // Use cleanAllFilters for API calls
  const url = buildUrl('/api/items', cleanAllFilters);
  const { data } = useFetch(url);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />

      <select
        value={filters.status}
        onChange={(e) => setFilter('status', e.target.value)}
      >
        <option value="">All</option>
        <option value="active">Active</option>
      </select>

      <button onClick={clearAll}>Clear All</button>
    </div>
  );
}
```

### URL-Synced Filters
```javascript
import { useUrlFilters } from '@/lib/hooks';

function FilteredListWithUrl() {
  const { filters, setFilter } = useUrlFilters({
    status: '',
    category: '',
  });

  // Filters automatically sync with URL query params
  // Example: ?status=active&category=electronics

  return (
    <div>
      <select
        value={filters.status}
        onChange={(e) => setFilter('status', e.target.value)}
      >
        {/* Options */}
      </select>
    </div>
  );
}
```

---

## useDebounce

### Debounce Search Input
```javascript
import { useDebounce } from '@/lib/hooks';
import { useState, useEffect } from 'react';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      // This only runs 500ms after user stops typing
      fetchResults(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Type to search..."
    />
  );
}
```

### Debounce Callback Function
```javascript
import { useDebouncedCallback } from '@/lib/hooks';

function AutoSaveForm() {
  const saveToServer = async (data) => {
    await post('/api/save', data);
  };

  const debouncedSave = useDebouncedCallback(saveToServer, 1000);

  return (
    <input
      onChange={(e) => {
        // Saves 1 second after user stops typing
        debouncedSave({ content: e.target.value });
      }}
    />
  );
}
```

### Complete Search with Debounce + Filters
```javascript
function AdvancedSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { filters, setFilter } = useFilters({
    status: '',
    category: '',
  });

  const url = buildUrl('/api/items', {
    search: debouncedSearch,
    ...filters,
  });

  const { data, loading } = useFetch(url, {
    deps: [debouncedSearch, filters], // Refetch when these change
  });

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* Filters */}
      {loading ? <Spinner /> : <Results data={data} />}
    </div>
  );
}
```

---

## useAsync

### Form Submission
```javascript
import { useAsync } from '@/lib/hooks';
import { post } from '@/lib/utils';

function CreateItemForm() {
  const createItem = async (data) => {
    return await post('/api/items', data);
  };

  const { execute, loading, error } = useAsync(createItem);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const result = await execute(data);

    if (result) {
      toast.success('Item created!');
      router.push('/items');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {error && <ErrorMessage message={error} />}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Item'}
      </button>
    </form>
  );
}
```

### With Success/Error Callbacks
```javascript
const { execute, loading } = useAsync(createItem, {
  onSuccess: (result) => {
    toast.success('Created successfully!');
    router.push(`/items/${result.id}`);
  },
  onError: (error) => {
    toast.error(error.message);
  },
});
```

### Delete with Confirmation
```javascript
function DeleteButton({ itemId }) {
  const deleteItem = async (id) => {
    return await del(`/api/items/${id}`);
  };

  const { execute, loading } = useAsync(deleteItem);

  const handleDelete = async () => {
    if (confirm('Are you sure?')) {
      await execute(itemId);
      router.push('/items');
    }
  };

  return (
    <button onClick={handleDelete} disabled={loading}>
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

### Multiple Operations
```javascript
import { useMultipleAsync } from '@/lib/hooks';

function ItemManager({ itemId }) {
  const operations = useMultipleAsync({
    update: (data) => put(`/api/items/${itemId}`, data),
    delete: () => del(`/api/items/${itemId}`),
    duplicate: () => post(`/api/items/${itemId}/duplicate`),
  });

  return (
    <div>
      <button
        onClick={() => operations.update.execute({ name: 'New Name' })}
        disabled={operations.update.loading}
      >
        Update
      </button>

      <button
        onClick={() => operations.delete.execute()}
        disabled={operations.delete.loading}
      >
        Delete
      </button>

      <button
        onClick={() => operations.duplicate.execute()}
        disabled={operations.duplicate.loading}
      >
        Duplicate
      </button>
    </div>
  );
}
```

---

## useLocalStorage

### Basic Usage
```javascript
import { useLocalStorage } from '@/lib/hooks';

function ThemeToggle() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button onClick={toggleTheme}>
      Current: {theme}
    </button>
  );
}
```

### Store User Preferences
```javascript
import { usePreferences } from '@/lib/hooks';

function SettingsPanel() {
  const { theme, setTheme, pageSize, setPageSize, sidebarOpen, setSidebarOpen } =
    usePreferences();

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>

      <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={sidebarOpen}
          onChange={(e) => setSidebarOpen(e.target.checked)}
        />
        Show Sidebar
      </label>
    </div>
  );
}
```

### Session Storage
```javascript
import { useSessionStorage } from '@/lib/hooks';

function FormWithSessionBackup() {
  const [formData, setFormData] = useSessionStorage('form-backup', {
    name: '',
    email: '',
  });

  // Form data persists only for the session
  // Cleared when browser is closed

  return (
    <form>
      <input
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
      />
    </form>
  );
}
```

---

## Complete Examples

### Full CRUD List Component
```javascript
import { useFetch, usePagination, useFilters, useDebounce } from '@/lib/hooks';
import { buildUrl } from '@/lib/utils';
import { useState } from 'react';

function ItemsListPage() {
  // Search
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Filters
  const { filters, setFilter, clearAllFilters, hasActiveFilters } = useFilters({
    status: '',
    category: '',
  });

  // Pagination
  const { page, pageSize, queryParams, goToPage, setPageSize } =
    useServerPagination();

  // Fetch data
  const url = buildUrl('/api/items', {
    search: debouncedSearch,
    ...filters,
    ...queryParams,
  });

  const { data, loading, error, refetch } = useFetch(url, {
    deps: [debouncedSearch, filters, page, pageSize],
  });

  return (
    <div>
      {/* Search */}
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search items..."
      />

      {/* Filters */}
      <select
        value={filters.status}
        onChange={(e) => setFilter('status', e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="available">Available</option>
        <option value="assigned">Assigned</option>
      </select>

      {hasActiveFilters && (
        <button onClick={clearAllFilters}>Clear Filters</button>
      )}

      {/* Results */}
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {data && (
        <>
          <ItemsTable items={data.items} />
          <Pagination
            page={page}
            totalPages={Math.ceil(data.total / pageSize)}
            goToPage={goToPage}
          />
        </>
      )}
    </div>
  );
}
```

### Form with Validation
```javascript
import { useAsync, useLocalStorage } from '@/lib/hooks';
import { post, validateForm, validationRules } from '@/lib/utils';
import { useState } from 'react';

function CreateItemForm() {
  const [formData, setFormData] = useLocalStorage('item-draft', {
    name: '',
    email: '',
    amount: '',
  });

  const [errors, setErrors] = useState({});

  const createItem = async (data) => {
    return await post('/api/items', data);
  };

  const { execute, loading, error } = useAsync(createItem, {
    onSuccess: () => {
      toast.success('Item created!');
      setFormData({ name: '', email: '', amount: '' }); // Clear draft
      router.push('/items');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const rules = {
      name: [validationRules.required(), validationRules.minLength(3)],
      email: [validationRules.required(), validationRules.email()],
      amount: [
        validationRules.required(),
        validationRules.positive(),
        validationRules.validAmount(),
      ],
    };

    const validation = validateForm(formData, rules);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    await execute(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div>
        <input
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: e.target.value })
          }
        />
        {errors.amount && <span className="error">{errors.amount}</span>}
      </div>

      {error && <ErrorMessage message={error} />}

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Item'}
      </button>
    </form>
  );
}
```

---

## Tips & Best Practices

1. **Always use deps array in useFetch** when the URL depends on state/props
2. **Combine hooks** - useFetch + usePagination + useFilters work great together
3. **Debounce search inputs** - Always use useDebounce for search to reduce API calls
4. **Use cleanFilters** - When building URLs, use `cleanFilters` to remove empty values
5. **Store form drafts** - Use useLocalStorage to auto-save form progress
6. **Handle loading states** - All hooks provide loading states, use them for UX
7. **Centralized error handling** - Use onError callbacks for consistent error handling

---

**Need more examples?** Check `/lib/hooks/` for full JSDoc documentation on each hook!
