const fs = require('fs');
let code = fs.readFileSync('components/offscript/screens/history.tsx', 'utf8');

code = code.replace(
  /transform: `translate\(calc\(60% \+ \$\{panOffset\.x\}px\), calc\(75% \+ \$\{panOffset\.y\}px\)\) scale\(\$\{zoom\}\) translate\(\$\{-activePoint\.x\}px, \$\{-activePoint\.y\}px\)`,\s*transformOrigin: `\$\{activePoint\.x\}px \$\{activePoint\.y\}px`,/m,
  `transform: \`translate(calc(40% + \${panOffset.x}px), calc(90% + \${panOffset.y}px)) scale(\${zoom}) rotate(\${-50 - activePoint.angleDeg}deg)\`,
              transformOrigin: \`\${centerX}px \${centerY}px\`,`
);

fs.writeFileSync('components/offscript/screens/history.tsx', code);
