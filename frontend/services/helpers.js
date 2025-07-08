// Genel yardımcı fonksiyonlar
export function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

export function replaceTurkishCharacters(text) {
  const map = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u',
                Ç: 'C', Ğ: 'G', İ: 'I', Ö: 'O', Ş: 'S', Ü: 'U' };
  return text.replace(/[çğıöşüÇĞİÖŞÜ]/g, c => map[c] || c);
}

export function formatDateForInput(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().split('T')[0];
}

export function getGroupedData() {
  const groups = {};
  document.querySelectorAll("[class*='data-']").forEach(el => {
    const cls = [...el.classList].find(c => c.startsWith('data-'));
    if (!cls || !el.name) return;
    const key = cls.replace('data-', '');
    groups[key] = groups[key] || {};
    let val = el.value;
    if (el.type === 'number') val = parseFloat(val) || 0;
    groups[key][el.name] = val;
  });
  return groups;
}