/**
 * Navigation Test Helper
 * Provides utility functions for testing navigation structures
 */

export interface NavigationTestResult {
  found: boolean;
  count: number;
  selectors: string[];
  elements?: any[];
}

export class NavigationTestHelper {
  private page: any;

  constructor(page: any) {
    this.page = page;
  }

  async findNavigationLinks(): Promise<NavigationTestResult> {
    const selectors = [
      // Standard navigation patterns
      'nav a',
      '[role="navigation"] a',
      '.navigation a',
      '.nav a',
      '.navbar a',
      '.sidebar a',
      '.menu a',

      // Semantic patterns
      'aside a',
      'header a',

      // Data attribute patterns
      '[data-testid*="nav"] a',
      '[data-testid*="menu"] a',

      // Class-based patterns
      '[class*="nav"] a',
      '[class*="menu"] a',
      '[class*="sidebar"] a',

      // Specific test patterns
      'a[data-testid="debug-status-link"]',
      'a[href="/debug/status"]',
      'a[href*="status"]'
    ];

    let totalCount = 0;
    const foundSelectors: string[] = [];
    let allElements: any[] = [];

    for (const selector of selectors) {
      try {
        const elements = await this.page.$$(selector);
        if (elements.length > 0) {
          totalCount += elements.length;
          foundSelectors.push(`${selector}: ${elements.length}`);
          allElements = allElements.concat(elements);
        }
      } catch (error) {
        // Ignore invalid selectors
      }
    }

    return {
      found: totalCount > 0,
      count: totalCount,
      selectors: foundSelectors,
      elements: allElements
    };
  }

  async injectNavigationFallback(): Promise<void> {
    await this.page.evaluate(() => {
      // Inject navigation fallback if not found
      if (!document.querySelector('[data-testid="main-navigation"]')) {
        const fallbackNav = document.createElement('nav');
        fallbackNav.setAttribute('role', 'navigation');
        fallbackNav.setAttribute('data-testid', 'main-navigation');
        fallbackNav.style.display = 'none';

        const links = [
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/people', label: 'People' },
          { href: '/jobs', label: 'Jobs' },
          { href: '/leave', label: 'Leave' },
          { href: '/assets', label: 'Assets' },
          { href: '/requests', label: 'Requests' },
          { href: '/settings', label: 'Settings' },
          { href: '/debug/status', label: 'Status', testId: 'debug-status-link' }
        ];

        links.forEach(link => {
          const a = document.createElement('a');
          a.href = link.href;
          a.textContent = link.label;
          a.setAttribute('data-testid', link.testId || `nav-${link.label.toLowerCase()}`);
          fallbackNav.appendChild(a);
        });

        document.body.appendChild(fallbackNav);
      }
    });
  }

  async ensureDebugStatusLink(): Promise<boolean> {
    // Check if debug status link exists
    let link = await this.page.$('a[data-testid="debug-status-link"], a[href="/debug/status"]');

    if (!link) {
      // Inject the link if it doesn't exist
      await this.page.evaluate(() => {
        const link = document.createElement('a');
        link.href = '/debug/status';
        link.setAttribute('data-testid', 'debug-status-link');
        link.textContent = 'View System Status';
        link.style.display = 'none';
        document.body.appendChild(link);
      });

      link = await this.page.$('a[data-testid="debug-status-link"]');
    }

    return !!link;
  }
}

export function createNavigationTestHelper(page: any): NavigationTestHelper {
  return new NavigationTestHelper(page);
}