const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/index.tsx'); // Adjusted path from scripts/
console.log(`Processing ${filePath}`);

if (!fs.existsSync(filePath)) {
    console.error("File not found!");
    process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

function addPrefixToClass(cls) {
    if (!cls || !cls.trim()) return cls;
    
    // Handle negative values e.g. -mx-4
    let isNegative = false;
    let prefix = '';
    
    if (cls.startsWith('-')) {
        isNegative = true;
        cls = cls.substring(1);
    }

    const parts = cls.split(':');
    let base = parts[parts.length - 1];

    // Skip already prefixed
    if (base.startsWith('tw-')) {
        return (isNegative ? '-' : '') + parts.join(':');
    }

    // Skip 'dark' class (selector)
    if (base === 'dark') {
        return (isNegative ? '-' : '') + parts.join(':');
    }

    // Check if base is a valid utility?
    // Heuristic: assume mostly valid utilities in this context.
    // If it's a known non-tailwind keyword (like 'group' -> 'tw-group'?)
    // Yes 'group' should be prefixed.
    
    // Prefix the base
    parts[parts.length - 1] = 'tw-' + base;
    
    return (isNegative ? '-' : '') + parts.join(':');
}

function processClassString(str) {
    // Preserve whitespace structure roughly? 
    // Or just simple split/join. Class lists don't care about whitespace.
    // However, we want to avoid creating infinite spaces.
    const chunks = str.split(/(\s+)/); // Split keeping delimiters
    return chunks.map(chunk => {
        if (/^\s+$/.test(chunk)) return chunk; // Return whitespace as is
        return addPrefixToClass(chunk);
    }).join('');
}

// 1. Replace className="..." 
// We use a regex that captures the content. 
content = content.replace(/className="([^"]*)"/g, (match, classes) => {
    return `className="${processClassString(classes)}"`;
});

// 2. Replace color: '...'
content = content.replace(/color: '([^']*)'/g, (match, classes) => {
    return `color: '${processClassString(classes)}'`;
});

// 3. Replace template literals in className={`...`}
content = content.replace(/className={`([\s\S]*?)`}/g, (match, inner) => {
    // inner is the content between backticks
    
    // Split by ${...} blocks to identify static text vs expressions
    // Split by regex capturing group
    const parts = inner.split(/(\$\{[^}]+\})/g);
    
    const processedParts = parts.map(part => {
        if (part.startsWith('${')) {
            // It's an expression like ${stat.color} or ternary
            // Process single-quoted strings inside that might be classes
            // Be careful not to replace random strings code, but in this file context it's likely safe for simple strings
            return part.replace(/'([^']+)'/g, (m, str) => {
                // Heuristic: if it looks like class (no spaces usually in single class string inside ternary, 
                // but 'bg-blue-500' is one class. 'bg-blue-500 text-white'? 
                // If it has spaces, handle that too.
                // Assuming str is a class string.
                if (/^[a-z0-9\s:/-]+$/.test(str)) {
                    return `'${processClassString(str)}'`;
                }
                return m;
            });
        } else {
            // Static text part of template literal
            return processClassString(part);
        }
    });

    return `className={\`${processedParts.join('')}\`}`;
});

fs.writeFileSync(filePath, content);
console.log("Done.");
