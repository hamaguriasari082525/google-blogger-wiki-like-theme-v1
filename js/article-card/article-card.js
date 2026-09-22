// article-card.js

(function () {
  'use strict';

  function create () {
    const card = document.createElement ('div');

    card.className = 'article-card';

    const header = document.createElement ('div');

    header.className = 'article-card-header';

    const title = document.createElement ('a');

    title.className = 'article-card-title';

    const body = document.createElement ('div');

    body.className = 'article-card-body';

    header.appendChild (title);

    card.appendChild (header);
    card.appendChild (body);

    return card;
  }

  function setData (card, data) {
    if (!card || !data) {
      return;
    }

    const title = card.querySelector (
      ':scope > .article-card-header > .article-card-title'
    );

    const body = card.querySelector (':scope > .article-card-body');

    if (!title || !body) {
      return;
    }

    title.href = data.url || '';

    const display = title.querySelector (':scope > .article-reference-display');

    title.replaceChildren ();

    if (display) {
      title.appendChild (display);
    }

    title.appendChild (document.createTextNode (data.title || ''));

    body.replaceChildren ();

    if (data.image) {
      const imageLink = document.createElement ('a');

      imageLink.className = 'article-card-image-link';

      imageLink.href = data.url || '';

      const image = document.createElement ('img');

      image.className = 'article-card-image';

      image.src = data.image.src;

      image.alt = data.image.alt || '';

      imageLink.appendChild (image);

      body.appendChild (imageLink);
    }

    if (data.meta || data.abstract) {
      const info = document.createElement ('div');

      info.className = 'article-card-info';

      if (data.meta) {
        const meta = document.createElement ('div');

        meta.className = 'article-card-meta';

        meta.textContent = data.meta;

        info.appendChild (meta);
      }

      if (data.abstract) {
        const abstract = document.createElement ('div');

        abstract.className = 'article-card-abstract';

        abstract.textContent = data.abstract;

        info.appendChild (abstract);
      }

      body.appendChild (info);
    }
  }

  window.articleCard = {
    create: create,
    setData: setData,
  };
}) ();
