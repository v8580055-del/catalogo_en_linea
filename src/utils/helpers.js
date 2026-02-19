export const parseDescription = (desc) => {
    if (!desc) return { title: '', description: '', variants: [] };
    const lines = desc.split('\n');
    const result = { title: '', description: '', variants: [] };
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('#')) {
            result.title = trimmed.replace(/^#\s*/, '');
        } else if (trimmed.startsWith('>')) {
            const parts = trimmed.replace(/^>\s*/, '').split('|');
            if (parts.length >= 2) {
                result.variants.push({
                    name: parts[0].trim(),
                    price: parts[1].trim()
                });
            }
        } else if (trimmed) {
            result.description += (result.description ? '\n' : '') + trimmed;
        }
    });
    return result;
};
