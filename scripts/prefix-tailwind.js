const fs = require('fs');
const path = require('path');

// Files to update
const files = [
  'src/pages/new/about.tsx',
  'src/pages/new/contact.tsx',
  'src/pages/new/prices.tsx',
  'src/pages/new/services.tsx',
];

// Common Tailwind class patterns to prefix
const tailwindClassPattern = /className=["']([^"']+)["']/g;
const tailwindClasses = new Set([
  // Layout
  'min-h-screen', 'h-screen', 'w-screen', 'h-full', 'w-full', 'container', 'mx-auto',
  // Flexbox & Grid
  'flex', 'inline-flex', 'grid', 'inline-grid', 'flex-row', 'flex-col', 'items-center', 
  'items-start', 'items-end', 'justify-center', 'justify-between', 'justify-start', 
  'justify-end', 'space-x-', 'space-y-', 'gap-',
  // Spacing
  'p-', 'm-', 'px-', 'py-', 'pt-', 'pb-', 'pl-', 'pr-', 'mx-', 'my-', 'mt-', 'mb-', 'ml-', 'mr-',
  // Sizing
  'w-', 'h-', 'min-w-', 'min-h-', 'max-w-', 'max-h-',
  // Colors
  'bg-', 'text-', 'border-',
  // Typography
  'font-', 'text-', 'leading-', 'tracking-', 'uppercase', 'lowercase', 'capitalize',
  // Borders
  'border', 'border-t', 'border-b', 'border-l', 'border-r', 'rounded', 'rounded-',
  // Effects
  'shadow', 'shadow-', 'opacity-',
  // Transitions
  'transition', 'duration-', 'ease-',
  // Display
  'block', 'inline-block', 'inline', 'hidden',
  // Position
  'relative', 'absolute', 'fixed', 'sticky',
  // Overflow
  'overflow-', 'overflow-x-', 'overflow-y-',
  // Dark mode
  'dark:',
  // Print
  'print-only', 'no-print',
  // Other common
  'transform', 'scale-', 'hover:', 'focus:', 'disabled:',
]);

function shouldPrefixClass(className) {
  // Don't prefix if already prefixed
  if (className.startsWith('tw-')) return false;
  
  // Check if it matches any Tailwind pattern
  for (const pattern of tailwindClasses) {
    if (className.startsWith(pattern) || className.includes(':' + pattern)) {
      return true;
    }
  }
  return false;
}

function prefixTailwindClasses(content) {
  return content.replace(tailwindClassPattern, (match, classes) => {
    const classList = classes.split(/\s+/);
    const prefixedClasses = classList.map(cls => {
      if (shouldPrefixClass(cls)) {
        // Handle dark: and other modifiers
        if (cls.includes(':')) {
          const parts = cls.split(':');
          return parts.map((part, i) => i === parts.length - 1 ? 'tw-' + part : part).join(':');
        }
        return 'tw-' + cls;
      }
      return cls;
    });
    return `className="${prefixedClasses.join(' ')}"`;
  });
}

// Process each file
files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const updated = prefixTailwindClasses(content);
    
    if (content !== updated) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`✓ Updated ${file}`);
    } else {
      console.log(`- No changes needed for ${file}`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message);
  }
});

console.log('\\nDone! All Tailwind classes have been prefixed with tw-');
