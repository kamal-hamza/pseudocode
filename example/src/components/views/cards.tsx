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

const CardsView: ViewRenderer = ({ entries, view, basesData, total, locale, slug }) => {
  const imageProperty = typeof view.image === "string" ? view.image : undefined;
  const columns = getColumns(view, basesData, entries).filter((column) => column !== imageProperty);
  const localeStrings = i18n(locale).components.bases;
  const cardSize = view.cardSize;
  const cardAspect = view.cardAspect;
  const gridStyle =
    typeof cardSize === "number" && cardSize > 0
      ? { gridTemplateColumns: `repeat(auto-fit, minmax(${cardSize}px, 1fr))` }
      : undefined;

  return (
    <div class="bases-cards-wrapper">
      <div class="bases-view-meta">
        {formatMessage(localeStrings.showingCount, {
          count: entries.length,
          total,
        })}
      </div>
      <div class="bases-cards" style={gridStyle}>
        {entries.map((entry) => {
          const ctx = { slug: entry.slug };
          const imageValue = imageProperty
            ? resolveEntryPropertyValue(imageProperty, entry)
            : undefined;
          const imageSrc = imageValue ? String(imageValue) : "";
          const imageStyle =
            typeof cardAspect === "number" && cardAspect > 0
              ? { aspectRatio: String(cardAspect) }
              : undefined;
          return (
            <div class="bases-card">
              {imageSrc && (
                <div class="bases-card-image" style={imageStyle}>
                  <img src={imageSrc} alt={entry.title} loading="lazy" />
                </div>
              )}
              <div class="bases-card-body">
                <a href={resolveRelative(slug, entry.slug)} class="internal" data-slug={entry.slug}>
                  {entry.title}
                </a>
                <div class="bases-card-meta">
                  {columns.map((column) => {
                    const value = resolveEntryPropertyValue(column, entry);
                    if (isEmptyValue(value)) return null;
                    return (
                      <div class="bases-card-row">
                        <span class="bases-card-label">{getColumnLabel(column, basesData)}</span>
                        <span class="bases-card-value">{renderCellValue(value, ctx)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const cardsViewRegistration: ViewTypeRegistration = {
  id: "cards",
  name: "Cards",
  icon: "layout-grid",
  render: CardsView,
};

export { CardsView };
