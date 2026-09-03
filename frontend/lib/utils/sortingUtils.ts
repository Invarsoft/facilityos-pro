export function sortSectorsSequentially<T extends { name: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const nameA = a.name.trim();
    const nameB = b.name.trim();

    // Standardize Tower 7 -> Tower T7 for comparison
    const normA = nameA.replace(/^tower\s+(\d+)$/i, 'Tower T$1');
    const normB = nameB.replace(/^tower\s+(\d+)$/i, 'Tower T$1');

    const isTowerA = normA.toLowerCase().includes('tower');
    const isTowerB = normB.toLowerCase().includes('tower');

    // Towers first (T1..Tn), then Blocks (Block A..Z)
    if (isTowerA && !isTowerB) return -1;
    if (!isTowerA && isTowerB) return 1;

    // Within same group, sort using natural alphanumeric comparison (T1 < T2 < ... < T10)
    return normA.localeCompare(normB, undefined, { numeric: true, sensitivity: 'base' });
  });
}

export function sortBlockNamesSequentially(names: string[]): string[] {
  const objects = names.map((name) => ({ name }));
  return sortSectorsSequentially(objects).map((item) => item.name);
}
