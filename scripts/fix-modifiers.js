const fs = require('fs');
const path = require('path');

// Files to update
const files = [
  'src/pages/new/index.tsx',
  'src/components/new/LoginForm.tsx',
  'src/components/new/PrintableInvoice.tsx',
  'src/components/new/SalesForm.tsx',
  'src/components/new/InvoicePreview.tsx',
  'src/components/new/Layout.tsx',
];

function fixFocusClasses(content) {
  // Fix focus: hover: disabled: etc. modifiers that don't have tw- prefix on the utility
  // Pattern: focus:ring-2 should become focus:tw-ring-2
  return content.replace(/(\s)(focus|hover|disabled|active|visited|group-hover|dark):([\w-]+)/g, (match, space, modifier, utility) => {
    // Don't prefix if already prefixed
    if (utility.startsWith('tw-')) {
      return match;
    }
    // Add tw- prefix to the utility
    return `${space}${modifier}:tw-${utility}`;
  });
}

// Process each file
files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const updated = fixFocusClasses(content);
    
    if (content !== updated) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`✓ Fixed focus/hover classes in ${file}`);
    } else {
      console.log(`- No changes needed for ${file}`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message);
  }
});

console.log('\nDone! All modifier classes have been prefixed with tw-');
