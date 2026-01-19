import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { sortingToQueryParam, queryParamToSorting } from './sorting';
import type { SortingState } from '@tanstack/react-table';

describe('Sorting Utilities', () => {
  beforeEach(() => {
    // Mock window.location and window.history
    const mockLocation = {
      search: '',
      pathname: '/',
      hash: '',
    } as unknown as Location;
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
      configurable: true,
    });
    window.history.replaceState = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('sortingToQueryParam', () => {
    it('should delete sorting param when sorting is empty', () => {
      window.location.search = '?sorting=col1:asc&page=1';

      sortingToQueryParam([]);

      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        '/?page=1',
      );
    });

    it('should delete sorting param when sorting is null or undefined', () => {
      window.location.search = '?sorting=col1:asc';

      sortingToQueryParam(null!);

      expect(window.history.replaceState).toHaveBeenCalledWith(null, '', '/');
    });

    it('should set sorting param for single column in ascending order', () => {
      window.location.search = '';
      const sorting: SortingState = [{ id: 'name', desc: false }];

      sortingToQueryParam(sorting);

      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        '/?sorting=name%3Aasc',
      );
    });

    it('should set sorting param for single column in descending order', () => {
      window.location.search = '';
      const sorting: SortingState = [{ id: 'age', desc: true }];

      sortingToQueryParam(sorting);

      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        '/?sorting=age%3Adesc',
      );
    });

    it('should set sorting param for multiple columns', () => {
      window.location.search = '';
      const sorting: SortingState = [
        { id: 'name', desc: false },
        { id: 'age', desc: true },
        { id: 'email', desc: false },
      ];

      sortingToQueryParam(sorting);

      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        '/?sorting=name%3Aasc%3Bage%3Adesc%3Bemail%3Aasc',
      );
    });

    it('should preserve other query parameters', () => {
      window.location.search = '?page=2&filter=active';
      const sorting: SortingState = [{ id: 'id', desc: true }];

      sortingToQueryParam(sorting);

      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        '/?page=2&filter=active&sorting=id%3Adesc',
      );
    });

    it('should replace existing sorting parameter', () => {
      window.location.search = '?sorting=oldcol:asc&page=1';
      const sorting: SortingState = [{ id: 'newcol', desc: true }];

      sortingToQueryParam(sorting);

      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        '/?sorting=newcol%3Adesc&page=1',
      );
    });
  });

  describe('queryParamToSorting', () => {
    it('should return empty array when no sorting param is present', () => {
      window.location.search = '';

      const result = queryParamToSorting(new Set(['col1']));

      expect(result).toEqual([]);
    });

    it('should parse single column ascending sort', () => {
      window.location.search = '?sorting=name:asc';

      const result = queryParamToSorting(new Set(['name', 'age']));

      expect(result).toEqual([{ id: 'name', desc: false }]);
    });

    it('should parse single column descending sort', () => {
      window.location.search = '?sorting=age:desc';

      const result = queryParamToSorting(new Set(['name', 'age']));

      expect(result).toEqual([{ id: 'age', desc: true }]);
    });

    it('should parse multiple columns', () => {
      window.location.search = '?sorting=name:asc;age:desc;email:asc';

      const result = queryParamToSorting(new Set(['name', 'age', 'email']));

      expect(result).toEqual([
        { id: 'name', desc: false },
        { id: 'age', desc: true },
        { id: 'email', desc: false },
      ]);
    });

    it('should treat non-desc direction as ascending', () => {
      window.location.search = '?sorting=name:aaa';

      const result = queryParamToSorting(new Set(['name']));

      expect(result).toEqual([{ id: 'name', desc: false }]);
    });

    it('should ignore malformed key-value pairs', () => {
      window.location.search = '?sorting=name:asc;age;email:desc';

      const result = queryParamToSorting(new Set(['name', 'age', 'email']));

      expect(result).toEqual([
        { id: 'name', desc: false },
        { id: 'email', desc: true },
      ]);
    });

    it('should ignore columns not in sortable columns set', () => {
      window.location.search = '?sorting=name:asc;phone:desc;age:asc';

      const result = queryParamToSorting(new Set(['name', 'age']));

      expect(result).toEqual([
        { id: 'name', desc: false },
        { id: 'age', desc: false },
      ]);
    });

    it('should handle mixed malformed and unsortable columns', () => {
      window.location.search = '?sorting=col1:asc;col2;col3:desc;col4:asc';

      const result = queryParamToSorting(new Set(['col1', 'col3']));

      expect(result).toEqual([
        { id: 'col1', desc: false },
        { id: 'col3', desc: true },
      ]);
    });

    it('should return empty array when sorting param is empty string', () => {
      window.location.search = '?sorting=';

      const result = queryParamToSorting(new Set(['col1']));

      expect(result).toEqual([]);
    });

    it('should handle empty sortable columns set', () => {
      window.location.search = '?sorting=name:asc;age:desc';

      const result = queryParamToSorting(new Set());

      expect(result).toEqual([]);
    });

    it('should preserve order of sorting columns', () => {
      window.location.search = '?sorting=z:asc;a:desc;m:asc';

      const result = queryParamToSorting(new Set(['z', 'a', 'm']));

      expect(result).toEqual([
        { id: 'z', desc: false },
        { id: 'a', desc: true },
        { id: 'm', desc: false },
      ]);
    });
  });
});
