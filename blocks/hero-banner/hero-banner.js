/**
 * loads and decorates the hero banner block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const rows = [...block.children];

  let bgRow = null;
  let categoryRow = null;
  let headingRow = null;
  let authorRow = null;
  let dateRow = null;
  const introRows = [];
  let foundHeading = false;

  rows.forEach((row) => {
    const cells = [...row.children];
    const first = cells[0];
    const second = cells[1];
    const hasPicture = !!first?.querySelector('picture');
    const hasHeading = !!first?.querySelector('h1, h2, h3');
    const isTwoColumn = cells.length === 2 && !!second?.textContent.trim();
    const text = first?.textContent.trim() ?? '';

    if (hasPicture && !text && !foundHeading && !categoryRow) {
      bgRow = row;
    } else if (hasHeading) {
      headingRow = row;
      foundHeading = true;
    } else if (isTwoColumn && foundHeading && !authorRow) {
      authorRow = row;
    } else if (!foundHeading && text) {
      categoryRow = row;
    } else if (foundHeading && /^[A-Za-z]+ \d{1,2},?\s*\d{4}$/.test(text) && !dateRow) {
      dateRow = row;
    } else if (foundHeading && text) {
      introRows.push(row);
    }
  });

  // Capture references before clearing
  const bgPicture = bgRow?.querySelector('picture');
  const catFirstCell = categoryRow?.querySelector(':scope > div');
  const catLink = catFirstCell?.querySelector('a');
  const catText = catFirstCell?.textContent.trim();
  const heading = headingRow?.querySelector('h1, h2, h3');
  const authorCells = authorRow ? [...authorRow.children] : [];
  const authorPicture = authorCells[0]?.querySelector('picture');
  const authorNameCell = authorCells[1] ?? null;
  const dateText = dateRow?.querySelector(':scope > div')?.textContent.trim();

  block.replaceChildren();

  // Content wrapper (placed first so picture never precedes h1 in DOM)
  const content = document.createElement('div');
  content.className = 'hero-banner-content';

  if (catText) {
    const tag = document.createElement('a');
    tag.className = 'hero-banner-category';
    tag.textContent = catText;
    if (catLink) tag.href = catLink.href;
    content.append(tag);
  }

  if (heading) {
    const h1 = document.createElement('h1');
    h1.innerHTML = heading.innerHTML;
    content.append(h1);
  }

  // Author + date meta row
  const meta = document.createElement('div');
  meta.className = 'hero-banner-meta';

  if (authorPicture || authorNameCell) {
    const authorDiv = document.createElement('div');
    authorDiv.className = 'hero-banner-author';

    if (authorPicture) {
      const avatarDiv = document.createElement('div');
      avatarDiv.className = 'hero-banner-author-avatar';
      avatarDiv.append(authorPicture);
      authorDiv.append(avatarDiv);
    }

    if (authorNameCell) {
      const paragraphs = [...authorNameCell.querySelectorAll('p')];
      const info = document.createElement('div');
      info.className = 'hero-banner-author-info';

      if (paragraphs.length >= 2) {
        const nameEl = document.createElement('span');
        nameEl.className = 'hero-banner-author-name';
        nameEl.textContent = paragraphs[0].textContent.trim();
        const roleEl = document.createElement('span');
        roleEl.className = 'hero-banner-author-role';
        roleEl.textContent = paragraphs[1].textContent.trim();
        info.append(nameEl, roleEl);
      } else if (paragraphs[0]) {
        const p = paragraphs[0];
        const brIdx = [...p.childNodes].findIndex((n) => n.nodeName === 'BR');
        const nameEl = document.createElement('span');
        nameEl.className = 'hero-banner-author-name';
        if (brIdx > -1) {
          nameEl.textContent = [...p.childNodes].slice(0, brIdx).map((n) => n.textContent).join('').trim();
          const roleText = [...p.childNodes].slice(brIdx + 1).map((n) => n.textContent).join('').trim();
          info.append(nameEl);
          if (roleText) {
            const roleEl = document.createElement('span');
            roleEl.className = 'hero-banner-author-role';
            roleEl.textContent = roleText;
            info.append(roleEl);
          }
        } else {
          nameEl.textContent = p.textContent.trim();
          info.append(nameEl);
        }
      }

      authorDiv.append(info);
    }

    meta.append(authorDiv);
  }

  if (dateText) {
    const dateEl = document.createElement('time');
    dateEl.className = 'hero-banner-date';
    dateEl.textContent = dateText;
    meta.append(dateEl);
  }

  if (meta.children.length) content.append(meta);

  if (introRows.length) {
    const intro = document.createElement('div');
    intro.className = 'hero-banner-intro';
    introRows.forEach((row) => {
      const cell = row.querySelector(':scope > div');
      if (cell) [...cell.childNodes].forEach((node) => intro.append(node));
    });
    content.append(intro);
  }

  block.append(content);

  // Background appended last so it never precedes h1 in DOM order
  if (bgPicture) {
    const bg = document.createElement('div');
    bg.className = 'hero-banner-background';
    bg.append(bgPicture);
    block.append(bg);
  }
}
