import type { ViewRenderer, ViewTypeRegistration } from "../../types";
import { i18n } from "../../i18n";
import {
  getColumnLabel,
  getColumns,
  isEmptyValue,
  renderCellValue,
  resolveEntryPropertyValue,
} from "../shared/cell";
import { resolveRelative } from "../../util/path";

function formatMessage(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replace(`{${key}}`, String(value)),
    template,
  );
}

const ListView: ViewRenderer = ({ entries, view, basesData, total, locale, slug }) => {
  const columns = getColumns(view, basesData, entries);
  const localeStrings = i18n(locale).components.bases;

  return (
    <div class="bases-list-wrapper">
      <div class="bases-view-meta">
        {formatMessage(localeStrings.showingCount, {
          count: entries.length,
          total,
        })}
      </div>
      <ul class="bases-list">
        {entries.map((entry) => {
          const ctx = { slug: entry.slug };
          return (
            <li class="bases-list-item">
              <a href={resolveRelative(slug, entry.slug)} class="internal" data-slug={entry.slug}>
                {entry.title}
              </a>
              {columns.length > 1 && (
                <div class="bases-list-meta">
                  {columns.slice(1).map((column) => {
                    const value = resolveEntryPropertyValue(column, entry);
                    if (isEmptyValue(value)) return null;
                    return (
                      <span class="bases-list-chip">
                        {getColumnLabel(column, basesData)}: {renderCellValue(value, ctx)}
                      </span>
                    );
                  })}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const listViewRegistration: ViewTypeRegistration = {
  id: "list",
  name: "List",
  icon: "list",
  render: ListView,
};

export { ListView };
