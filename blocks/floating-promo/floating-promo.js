/**
 * decorate the floating-promo block
 * @param {Element} block the block
 */
export default function decorate(block) {
  const rows = [...block.children];

  let picture = null;
  let heading = null;
  let descPara = null;
  let ctaLink = null;

  rows.forEach((row) => {
    const cell = row.firstElementChild;
    if (!cell) return;

    if (cell.querySelector('picture')) {
      picture = cell.querySelector('picture');
    } else if (cell.querySelector('h1, h2, h3, h4, h5, h6')) {
      heading = cell.querySelector('h1, h2, h3, h4, h5, h6');
    } else if (cell.querySelector('a[href]')) {
      ctaLink = cell.querySelector('a[href]');
    } else if (cell.querySelector('p')) {
      descPara = cell.querySelector('p');
    }
  });

  block.replaceChildren();

  if (picture) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'floating-promo-image';
    imageDiv.append(picture);
    block.append(imageDiv);
  }

  const body = document.createElement('div');
  body.className = 'floating-promo-body';

  if (heading) body.append(heading);
  if (descPara) body.append(descPara);

  if (ctaLink) {
    ctaLink.classList.add('floating-promo-btn');
    body.append(ctaLink);
  }

  block.append(body);

  // Wrap only the article body and the promo sidebar in an inner grid container.
  // This leaves hero-banner and author-info above the grid in normal document flow.
  const section = block.closest('.section');
  if (!section) return;
  const contentWrapper = section.querySelector('.default-content-wrapper');
  const promoWrapper = block.parentElement;
  if (!contentWrapper || !promoWrapper) return;

  const grid = document.createElement('div');
  grid.className = 'floating-promo-grid';
  contentWrapper.replaceWith(grid);
  grid.append(contentWrapper, promoWrapper);
}
