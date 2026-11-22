import { portfolio } from './portfolio-content.js?v=privacy-20261119';
import { screenshotForTheme } from './project-image-theme.js?v=privacy-20261119';

const text = (value, language) => typeof value === 'string' ? value : value[language] ?? value.en;
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
let renderedLanguage;

export function renderPortfolio(language) {
  if (renderedLanguage === language) return;
  renderedLanguage = language;
  const pick = value => escape(text(value, language));
  const label = key => pick(portfolio.labels[key]);
  const about = document.getElementById('portfolio-about-content');
  const education = document.getElementById('portfolio-education-content');
  const positions = [about.closest('.about-panel'), education.closest('.local-tool-panel')].map(element => [element, element.scrollTop]);
  const educationCards = () => portfolio.education.map((item, index) => `
    <article class="resume-school">
      <span class="resume-item-index">0${index + 1}</span>
      <div><h3>${pick(item.school)}</h3><p class="resume-degree">${pick(item.degree)}</p><p class="resume-meta"><time>${escape(item.period)}</time><span>${pick(item.city)}</span></p></div>
    </article>`).join('');

  about.innerHTML = `
    <header class="resume-profile-header">
      <div><span class="resume-eyebrow">MIAO / ${label('about')}</span><h1>${pick(portfolio.name)}</h1><p class="resume-role">${pick(portfolio.role)}</p></div>
      <img class="resume-portrait" src="/_p/miao-portrait-watercolor.jpg" alt="${label('portrait')}" width="104" height="132" />
    </header>
    <div class="resume-introduction"><p>${pick(portfolio.intro)}</p><p>${pick(portfolio.description)}</p></div>
    <section class="resume-section resume-delivery"><h2>${pick(portfolio.delivery.title)}</h2><p>${pick(portfolio.delivery.description)}</p></section>
    <section class="resume-section"><h2>${label('work')}</h2><div class="resume-timeline">
      ${portfolio.experience.map(item => `<article class="resume-job"><div class="resume-job-heading"><h3>${pick(item.company)}<span>${pick(item.role)}</span></h3><time>${escape(item.period)}</time></div><p class="resume-job-city">${pick(item.city)}</p><p>${pick(item.description)}</p></article>`).join('')}
    </div></section>
    <section class="resume-section"><h2>${label('education')}</h2>${educationCards()}</section>
    <section class="resume-section"><h2>${label('skills')}</h2><dl class="resume-skills">
      <div><dt>${label('currentTools')}</dt><dd>${portfolio.tools.map(escape).join(' · ')}</dd></div>
      <div><dt>${label('languages')}</dt><dd>${label('languageDetail')}</dd></div>
    </dl></section>`;

  education.innerHTML = `${educationCards()}<section class="resume-section"><h2>${label('languages')}</h2><p class="resume-language-note">${label('languageDetail')}</p></section>`;
  for (const [element, position] of positions) element.scrollTop = position;
}

export function projectDetailMarkup(project, language, screenshotTheme = 'light') {
  const pick = value => escape(text(value, language));
  const label = key => pick(portfolio.labels[key]);
  const gallery = project.designScreens?.length ? `
    <section class="project-design-gallery" aria-labelledby="project-design-heading">
      <header><h3 id="project-design-heading">${project.galleryTitle ? pick(project.galleryTitle) : label('designGallery')}</h3><span>${String(project.designScreens.length).padStart(2, '0')}</span></header>
      <p>${project.galleryHint ? pick(project.galleryHint) : label('designGalleryHint')}</p>
      ${project.designScreens.some(screen => screen.variants) ? `<p class="project-gallery-theme" data-gallery-theme-status aria-live="polite">${label(screenshotTheme === 'dark' ? 'nightScreens' : 'dayScreens')}</p>` : ''}
      <div class="project-design-rail">
        ${project.designScreens.map((screen, index) => {
          const asset = screenshotForTheme(screen, screenshotTheme);
          return `<figure>
          <button class="project-design-thumbnail" type="button" data-design-index="${index}" aria-haspopup="dialog" aria-controls="project-design-viewer" aria-label="${label('openDesign')}：${pick(screen.title)}">
            <img src="${escape(asset.thumbnail)}" alt="${pick(screen.title)}" width="${asset.thumbnailWidth ?? 320}" height="${asset.thumbnailHeight ?? 695}" style="aspect-ratio: ${asset.width} / ${asset.height}" loading="lazy" decoding="async" />
            <span class="project-design-zoom" aria-hidden="true">↗</span>
          </button>
          <figcaption><span>${String(index + 1).padStart(2, '0')}</span>${pick(screen.title)}</figcaption>
        </figure>`; }).join('')}
      </div>
    </section>` : '';
  const responsibilities = project.responsibilities?.length ? `
    <h3>${label('responsibilities')}</h3><dl class="case-responsibilities">
      ${project.responsibilities.map(item => `<div><dt>${pick(item.title)}</dt><dd>${pick(item.description)}</dd></div>`).join('')}
    </dl>` : '';
  const technicalPlan = project.technicalPlan ? `
    <figure class="case-strategy" aria-labelledby="case-strategy-title">
      <h3 id="case-strategy-title">${pick(project.technicalPlan.title)}</h3>
      <div class="case-strategy-cause">${pick(project.technicalPlan.cause)}</div>
      <div class="case-strategy-connector" aria-hidden="true">↓</div>
      <ul class="case-strategy-branches">${project.technicalPlan.branches.map(item => `<li><strong>${pick(item.title)}</strong><p>${pick(item.description)}</p></li>`).join('')}</ul>
      <div class="case-strategy-connector" aria-hidden="true">↓</div>
      <div class="case-strategy-goal">${pick(project.technicalPlan.goal)}</div>
      <figcaption>${pick(project.technicalPlan.caption)}</figcaption>
    </figure>` : '';
  const results = project.results?.length
    ? `<div class="case-results">${project.results.map(item => `<section><h4>${pick(item.title)}</h4><p>${pick(item.description)}</p></section>`).join('')}</div>`
    : `<p>${pick(project.outcome)}</p>`;
  return `<article class="water-detail-article" data-project="${project.id}">
    <p class="water-detail-meta">${pick(project.company)}<span>${escape(project.period)}</span></p>
    <h2 id="water-project-title">${pick(project.title)}</h2>
    <p class="water-detail-subtitle">${pick(project.subtitle)}</p>
    <div class="resume-tags">${project.tags.map(tag => `<span>${escape(tag)}</span>`).join('')}</div>
    ${project.galleryPlacement === 'afterOutcome' ? '' : gallery}
    <dl class="resume-metrics">${project.metrics.map(([value, description]) => `<div><dt>${escape(value)}</dt><dd>${pick(description)}</dd></div>`).join('')}</dl>
    <div class="resume-case"><h3>${label('challenge')}</h3><p>${pick(project.challenge)}</p>${responsibilities}${technicalPlan}<h3>${project.approachTitle ? pick(project.approachTitle) : label('approach')}</h3><ul>${project.approach.map(value => `<li>${pick(value)}</li>`).join('')}</ul><h3>${label('outcome')}</h3>${results}${project.delivery ? `<h3>${pick(project.delivery.title)}</h3><p>${pick(project.delivery.description)}</p>` : ''}</div>
    ${project.galleryPlacement === 'afterOutcome' ? gallery : ''}
  </article>`;
}
