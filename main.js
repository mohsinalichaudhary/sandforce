/**
 * SANDFORCE HEAVY EQUIPMENT PARTS - L.L.C - S.P.C
 * Minimalist Frontend Controller & Clean URL Router for GitHub Pages
 */

// ==========================================================================
// 1. CLEAN URL ENGINE (Removes .html on live hosts; preserves on file:///)
// ==========================================================================
(function () {
  const isHttp = window.location.protocol.startsWith('http');
  if (!isHttp) return;

  // Immediate address bar cleaner
  try {
    const path = window.location.pathname;
    let newPath = null;
    if (path.endsWith('/index.html')) {
      newPath = path.slice(0, -10);
    } else if (path.endsWith('.html')) {
      newPath = path.slice(0, -5);
    }
    if (newPath !== null) {
      const cleanUrl = (newPath || '/') + window.location.search + window.location.hash;
      window.history.replaceState(null, '', cleanUrl);
    }
  } catch (e) {
    // Graceful fallback
  }

  // Rewrite internal links on live servers so clicks navigate cleanly without .html
  function transformInternalLinks() {
    document.querySelectorAll('a[href]').forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('//') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        href.startsWith('#')
      ) {
        return;
      }

      if (href === 'index.html' || href === './index.html') {
        link.setAttribute('href', './');
      } else if (href.endsWith('.html')) {
        link.setAttribute('href', href.slice(0, -5));
      } else if (href.includes('.html#')) {
        link.setAttribute('href', href.replace('.html#', '#'));
      } else if (href.includes('.html?')) {
        link.setAttribute('href', href.replace('.html?', '?'));
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', transformInternalLinks);
  } else {
    transformInternalLinks();
  }
})();

// ==========================================================================
// 2. GLOBAL CONTROLLERS (Mobile Drawer, Fast WhatsApp, Contact Utilities)
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {
  // Mobile Drawer Toggle
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const header = document.querySelector('.site-header');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', function () {
      const isOpen = drawer.classList.contains('active');
      if (isOpen) {
        drawer.classList.remove('active');
        toggleBtn.classList.remove('open');
        document.body.style.overflow = '';
      } else {
        if (header) {
          drawer.style.top = header.offsetHeight + 'px';
        }
        drawer.classList.add('active');
        toggleBtn.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });

    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        drawer.classList.remove('active');
        toggleBtn.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Direct WhatsApp Launcher
  window.inquireWhatsApp = function (productName) {
    const text = productName
      ? `Hello Sandforce Team, I would like to request a quotation for: ${productName}. Please let me know price and availability.`
      : `Hello Sandforce Team, I would like to inquire about heavy equipment spare parts.`;
    const url = `https://wa.me/971567861146?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Direct Email Launcher
  window.inquireEmail = function (productName) {
    const subject = encodeURIComponent(`Quotation Request: ${productName || 'Heavy Equipment Spare Parts'}`);
    const body = encodeURIComponent(
      `Hello Sandforce Sales Team,\n\nI am inquiring about availability and pricing for:\nProduct: ${productName || 'Equipment Parts'}\n\nPlease get in touch with me.\n\nThank you.`
    );
    window.location.href = `mailto:sales@sandforce.ae?cc=sales.sandforce@gmail.com&subject=${subject}&body=${body}`;
  };

  // Copy text utility
  window.copyText = function (text, label) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () {
        showToast(`Copied ${label}: ${text}`);
      });
    } else {
      showToast(`Copied: ${text}`);
    }
  };

  function showToast(msg) {
    let t = document.getElementById('siteToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'siteToast';
      t.style.cssText =
        'position:fixed;bottom:24px;right:24px;background:#0B2238;color:#FFFFFF;padding:12px 20px;font-family:monospace;font-size:12px;z-index:9999;border-left:3px solid #05527C;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:opacity 0.2s;';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(function () {
      t.style.opacity = '0';
    }, 2500);
  }
});
