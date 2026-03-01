/* --- ScrollSpy + Nav Group Toggle (shared) --- */
(function() {
  var navLinks = document.querySelectorAll('.ds-sidebar a[data-nav]');
  var sections = document.querySelectorAll('[data-section]');

  // ScrollSpy — skip if no sidebar nav links
  if (navLinks.length && sections.length) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('data-section');
          navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('data-nav') === id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });

    sections.forEach(function(s) { observer.observe(s); });

    // Smooth scroll for sidebar links
    navLinks.forEach(function(a) {
      a.addEventListener('click', function(e) {
        var href = a.getAttribute('href');
        if (href && href.charAt(0) === '#') {
          e.preventDefault();
          var target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }
})();

/* --- Nav Group Toggle --- */
function toggleNavGroup(btn) {
  var items = btn.nextElementSibling;
  var arrow = btn.querySelector('svg');
  items.classList.toggle('open');
  if (arrow) arrow.style.transform = items.classList.contains('open') ? '' : 'rotate(-90deg)';
}
