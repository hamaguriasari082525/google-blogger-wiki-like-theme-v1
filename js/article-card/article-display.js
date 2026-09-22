// article-display.js

(function () {
  'use strict';
  
  function createCards () {
    const card = window.articleCard;

    if (!card) {
      console.warn ('[ArticleDisplay] Article Card not found.');
      return [];
    }

    const embeds = document.querySelectorAll ('article-embed');

    const items = [];

    embeds.forEach (function (embed) {
      if (embed.dataset.articleDisplayApplied === 'true') {
        return;
      }

      const url = embed.getAttribute ('url');

      if (!url) {
        console.warn ('[ArticleDisplay] Article URL not found.');
        return;
      }

      const articleCard = card.create ();

      embed.replaceWith (articleCard);

      embed.dataset.articleDisplayApplied = 'true';

      items.push ({
        card: articleCard,
        url: url,
      });
    });

    return items;
  }

  async function loadData (items) {
    const loader = window.articleLoader;

    const card = window.articleCard;

    if (!loader) {
      console.warn ('[ArticleDisplay] Article Loader not found.');
      return;
    }

    if (!card) {
      console.warn ('[ArticleDisplay] Article Card not found.');
      return;
    }

    await Promise.all (
      items.map (async function (item) {
        try {
          const data = await loader.load (item.url);

          card.setData (item.card, data);
        } catch (error) {
          console.error ('[ArticleDisplay] Article failed:', item.url, error);
        }
      })
    );
  }

  function process () {
    const items = createCards ();

    loadData (items);
  }

  window.articleDisplay = {
    process: process,
  };
}) ();
