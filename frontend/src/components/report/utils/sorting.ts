import type { SortingState } from '@tanstack/react-table';

const SORTING_QUERY_PARAM = 'sorting';
const SORTING_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
};

// assuming that column ids won't contain ":" or ";" symbols
const COLUMNS_DELIM = ';';
const KV_DELIM = ':';

export function sortingToQueryParam(sorting: SortingState): void {
  const params = new URLSearchParams(window.location.search);

  if (!sorting || sorting.length === 0) {
    params.delete(SORTING_QUERY_PARAM);
  } else {
    const sortingParamValue = sorting
      .map(
        (col) =>
          `${col.id}${KV_DELIM}${col.desc ? SORTING_DIRECTION.DESC : SORTING_DIRECTION.ASC}`,
      )
      .join(COLUMNS_DELIM);
    params.set(SORTING_QUERY_PARAM, sortingParamValue);
  }

  const paramsStr = params.toString();
  const newURL = paramsStr
    ? `${window.location.pathname}?${paramsStr}`
    : window.location.pathname;
  window.history.replaceState(null, '', newURL);
}

/**
 * This function reads the query parameter 'sorting' and converts it in the SortingState object for Tanstack Table.
 * The query parameter value should be in the format "colName1:dir1;colName2:dir2", with the following applied:
 *  - malformed "colName:dir" key-value pairs, e.g. "colName", are silently ignored
 *  - illegal "colName" values, i.e. col ids that are not amongst sortable column ids, are silently ignored
 *  - any dir value that is not 'desc' is treated as 'asc'
 *
 * TODO: We can consider this function in future to also sanitise the query parameter:
 *  - to delete malformed key-value pairs in it
 *  - to dedup column names
 */
export function queryParamToSorting(
  sortableColumns: Set<string>,
): SortingState {
  const params = new URLSearchParams(window.location.search);
  const sortingParam = params.get(SORTING_QUERY_PARAM);

  if (!sortingParam) {
    return [];
  }

  return sortingParam
    .split(COLUMNS_DELIM)
    .map((kv) => kv.split(KV_DELIM))
    .filter((tokens) => tokens.length === 2)
    .filter(([key]) => sortableColumns.has(key))
    .map(([key, dir]) => ({
      id: key,
      desc: dir === SORTING_DIRECTION.DESC,
    }));
}
