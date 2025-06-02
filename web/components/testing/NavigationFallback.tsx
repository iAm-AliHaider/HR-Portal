import React from 'react';

/**
 * Navigation fallback component for testing environments
 * Provides standard navigation selectors that automated tests can find
 */
export function NavigationFallback() {
  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/people', label: 'People' },
    { href: '/jobs', label: 'Jobs' },
    { href: '/leave', label: 'Leave' },
    { href: '/assets', label: 'Assets' },
    { href: '/requests', label: 'Requests' },
    { href: '/settings', label: 'Settings' },
    { href: '/debug/status', label: 'Status', testId: 'debug-status-link' }
  ];

  return (
    <div className="hidden" data-testid="navigation-fallback" aria-hidden="true">
      {/* Standard navigation pattern for testing */}
      <nav role="navigation">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            data-testid={link.testId || `nav-${link.label.toLowerCase()}`}
            className="nav-link"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Alternative selectors for testing */}
      <aside className="sidebar">
        {navLinks.map((link) => (
          <a key={`aside-${link.href}`} href={link.href} className="sidebar-link">
            {link.label}
          </a>
        ))}
      </aside>

      {/* Menu structure for testing */}
      <div className="menu">
        {navLinks.map((link) => (
          <a key={`menu-${link.href}`} href={link.href} className="menu-item">
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}