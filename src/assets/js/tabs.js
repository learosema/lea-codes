const $$ = document.querySelectorAll.bind(document);

$$('[role="tab"]').forEach(tab => {
  tab.addEventListener('click', () => {

    const controls = tab.getAttribute('aria-controls');
    const tabs = tab.parentNode.querySelectorAll('[role="tab"]');
    const panels = tab.parentNode.parentNode.querySelectorAll('[role="tabpanel"]');
    tabs.forEach(t => {
      t.setAttribute('aria-selected', t === tab);
    });
    panels.forEach(panel => {
      const selected = panel.getAttribute('id') === controls;
      if (selected) {
        panel.removeAttribute('data-state');

        // find the first focusable element inside the panel and focus it.
        panel.querySelector('a, button, [tabindex]')?.focus();
      } else {
        panel.setAttribute('data-state', 'hidden');
      }
    });
  });
});
