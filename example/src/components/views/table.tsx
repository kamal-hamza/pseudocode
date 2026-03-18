import type { ViewRenderer, ViewTypeRegistration } from "../../types";
import { i18n } from "../../i18n";
import {
  formatValue,
  getColumnLabel,
  getColumns,
  renderCellValue,
  resolveEntryPropertyValue,
} from "../shared/cell";
import { computeSummary } from "../shared/summary";
import { resolveRelative } from "../../util/path";

function formatMessage(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replace(`{${key}}`, String(value)),
    template,
  );
}

const TableView: ViewRenderer = ({ entries, view, basesData, total, locale, slug }) => {
  const columns = getColumns(view, basesData, entries);
  const summaries = view.summaries ?? {};
  const hasSummary = Object.keys(summaries).length > 0;
  const localeStrings = i18n(locale).components.bases;

  return (
    <div class="bases-table-wrapper">
      <div class="bases-view-meta">
        {formatMessage(localeStrings.showingCount, {
          count: entries.length,
          total,
        })}
      </div>
      <table class="bases-table" data-view-type="table">
        <thead>
          <tr>
            {columns.map((column) => {
              const columnWidth = view.columnSize?.[column];
              const style = columnWidth
                ? { width: `${columnWidth}px`, minWidth: `${columnWidth}px` }
                : undefined;
              return (
                <th data-column={column} data-sortable="true" style={style}>
                  {getColumnLabel(column, basesData)}
                  <span class="bases-sort-indicator" aria-hidden="true" />
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const ctx = { slug: entry.slug };
            return (
              <tr>
                {columns.map((column) => {
                  const value = resolveEntryPropertyValue(column, entry);
                  const display = formatValue(value);
                  const isPrimary = column === "file.name" || column === "title";
                  const columnWidth = view.columnSize?.[column];
                  const style = columnWidth
                    ? { width: `${columnWidth}px`, minWidth: `${columnWidth}px` }
                    : undefined;
                  return (
                    <td data-value={display} style={style}>
                      {isPrimary ? (
                        <a
                          href={resolveRelative(slug, entry.slug)}
                          class="internal"
                          data-slug={entry.slug}
                        >
                          {display || entry.title}
                        </a>
                      ) : (
                        renderCellValue(value, ctx)
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        {hasSummary && (
          <tfoot>
            <tr class="bases-summary-row">
              {columns.map((column) => {
                const summary = summaries[column];
                if (!summary) return <td />;
                const values = entries.map((entry) => resolveEntryPropertyValue(column, entry));
                return <td>{computeSummary(values, summary)}</td>;
              })}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export const tableViewRegistration: ViewTypeRegistration = {
  id: "table",
  name: "Table",
  icon: "table",
  render: TableView,
};

export { TableView };
