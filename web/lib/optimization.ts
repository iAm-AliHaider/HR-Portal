// import { QueryClient } from '@tanstack/react-query';
// const queryClient = new QueryClient();

export const applyOptimizations = () => {
  // Preconnect to critical origins
  document.head.insertAdjacentHTML(
    'beforeend',
    '<link rel="preconnect" href="https://supabase.co" crossorigin>'
  )

  // Service Worker setup
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      type: 'module'
    })
  }

  // React Query default config
  // queryClient.setDefaultOptions({
  //   queries: {
  //     staleTime: 5 * 60 * 1000, // 5 minutes
  //     gcTime: 15 * 60 * 1000, // 15 minutes
  //   }
  // })
} 