export function simplifySlug(slug: string): string {
  if (slug.endsWith("/index")) return slug.slice(0, -6);
  return slug;
}

export function resolveRelative(current: string, target: string): string {
  const simpleCurrent = simplifySlug(current);
  const simpleTarget = simplifySlug(target);
  const currentParts = simpleCurrent.split("/").filter(Boolean);
  const targetParts = simpleTarget.split("/").filter(Boolean);
  currentParts.pop();
  let prefix = "";
  const commonLength = Math.min(currentParts.length, targetParts.length);
  let common = 0;
  for (let i = 0; i < commonLength; i++) {
    if (currentParts[i] === targetParts[i]) {
      common++;
    } else {
      break;
    }
  }
  const ups = currentParts.length - common;
  if (ups > 0) {
    prefix = "../".repeat(ups);
  } else {
    prefix = "./";
  }
  return prefix + targetParts.slice(common).join("/");
}

export function pathToRoot(slug: string): string {
  const parts = simplifySlug(slug).split("/").filter(Boolean);
  if (parts.length <= 1) return ".";
  return "../".repeat(parts.length - 1).slice(0, -1);
}
