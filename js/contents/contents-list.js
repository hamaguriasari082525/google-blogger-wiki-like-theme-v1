// contents-list.js

(function () {
  'use strict';

  function buildContentsList () {
    const core = window.articleContentsCore;

    if (!core) {
      console.warn ('[ContentsList] Contents Core not found.');
      return;
    }

    const contents = document.querySelector ('.contents nav');
    const contentsBox = document.querySelector ('.contents');

    if (!contents) {
      return;
    }

    const headings = core.getHeadings ();

    if (!headings.length) {
      if (contentsBox) {
        contentsBox.style.display = 'none';
      }

      contents.innerHTML = '';
      return;
    }

    if (contentsBox) {
      contentsBox.style.display = '';
    }

    const list = document.createElement ('ul');

    headings.forEach (function (heading) {
      const number = core.getNumber (heading);
      const title = core.getTitle (heading);

      if (!number || !title) {
        return;
      }

      const li = document.createElement ('li');
      const link = document.createElement ('a');

      link.href = '#' + heading.id;

      const numberElement = document.createElement ('span');
      numberElement.className = 'contents-number';
      numberElement.textContent = number;

      const titleElement = document.createElement ('span');
      titleElement.className = 'contents-item-title';
      titleElement.textContent = title;

      link.appendChild (numberElement);
      link.appendChild (titleElement);

      if (heading.tagName.toLowerCase () === 'h3') {
        li.classList.add ('level-2');
      }

      li.appendChild (link);
      list.appendChild (li);
    });

    contents.innerHTML = '';
    contents.appendChild (list);
  }

  window.articleContentsList = {
    process: buildContentsList,
  };
}) ();
