/**
 * loads and decorates the hero banner block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const rows = [...block.children];

  // Row containing a heading = content row; first other row = metadata row
  const contentRow = rows.find((row) => row.querySelector('h1, h2, h3'));
  const metaRow = rows.find((row) => row !== contentRow);

  const metaCells = metaRow ? [...metaRow.children] : [];
  const contentCells = contentRow ? [...contentRow.children] : [];

  const categoryCell = metaCells[0] ?? null;
  const dateCell = metaCells[1] ?? null;
  const readTimeCell = metaCells[2] ?? null;
  const headingCell = contentCells[0] ?? null;
  const imageCell = contentCells[1] ?? null;

  const catLink = categoryCell?.querySelector('a');
  const catText = categoryCell?.textContent.trim();
  const dateText = dateCell?.textContent.trim();
  const readTimeText = readTimeCell?.textContent.trim();
  const heading = headingCell?.querySelector('h1, h2, h3');
  const image = imageCell?.querySelector('picture');

  block.replaceChildren();

  const outer = document.createElement('div');
  outer.className = 'hero-banner-content';

  // ── Left: text column ──────────────────────────────────────────────────────
  const textCol = document.createElement('div');
  textCol.className = 'hero-banner-text';

  if (catText || dateText || readTimeText) {
    const meta = document.createElement('div');
    meta.className = 'hero-banner-meta';

    if (catText) {
      const tag = document.createElement('a');
      tag.className = 'hero-banner-category';
      tag.textContent = catText;
      if (catLink) tag.href = catLink.href;
      meta.append(tag);
    }

    if (dateText) {
      const dateEl = document.createElement('time');
      dateEl.className = 'hero-banner-date';
      dateEl.textContent = dateText;
      meta.append(dateEl);
    }

    if (readTimeText) {
      const pipe = document.createElement('span');
      pipe.className = 'hero-banner-pipe';
      pipe.setAttribute('aria-hidden', 'true');

      const rt = document.createElement('span');
      rt.className = 'hero-banner-read-time';
      rt.textContent = readTimeText;
      meta.append(pipe, rt);
    }

    textCol.append(meta);
  }

  if (heading) {
    const h1 = document.createElement('h1');
    h1.innerHTML = heading.innerHTML;
    textCol.append(h1);
  }

  outer.append(textCol);

  // ── Right: image column ────────────────────────────────────────────────────
  if (image) {
    const imgCol = document.createElement('div');
    imgCol.className = 'hero-banner-image';
    imgCol.append(image);
    outer.append(imgCol);
  }

  block.append(outer);
}
