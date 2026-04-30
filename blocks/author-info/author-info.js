import { decorateIcons } from '../../scripts/aem.js';

const SOCIAL_PLATFORMS = {
  'x.com': { icon: 'x', label: 'X (formerly Twitter)' },
  'twitter.com': { icon: 'x', label: 'X (formerly Twitter)' },
  'linkedin.com': { icon: 'linkedin', label: 'LinkedIn' },
  'facebook.com': { icon: 'facebook', label: 'Facebook' },
};

function detectPlatform(href) {
  try {
    const { hostname } = new URL(href);
    const entry = Object.entries(SOCIAL_PLATFORMS)
      .find(([domain]) => hostname.includes(domain));
    return entry ? entry[1] : null;
  } catch {
    return null;
  }
}

export default async function decorate(block) {
  const row = block.firstElementChild;
  const [authorCell, socialCell] = [...row.children];

  const authorName = authorCell.querySelector('a')?.textContent.trim() || '';

  const attributionDiv = document.createElement('div');
  attributionDiv.className = 'author-info-attribution';
  attributionDiv.append(...authorCell.childNodes);

  const socialDiv = document.createElement('div');
  socialDiv.className = 'author-info-social';

  if (socialCell) {
    socialCell.querySelectorAll('a').forEach((link) => {
      const platform = detectPlatform(link.href);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener');
      if (platform) {
        link.setAttribute('aria-label', `${authorName} on ${platform.label}`.trim());
        link.innerHTML = `<span class="icon icon-${platform.icon}"></span>`;
      }
      socialDiv.append(link);
    });
  }

  block.replaceChildren(attributionDiv);
  if (socialDiv.children.length) block.append(socialDiv);
  decorateIcons(block);
}
