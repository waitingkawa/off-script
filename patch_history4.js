const fs = require('fs');
let code = fs.readFileSync('components/offscript/screens/history.tsx', 'utf8');

code = code.replace(
  /const centerX = 0\s+const centerY = 0\s+const arcRadius = 600\s+const startAngle = -140\s+const endAngle = -50/m,
  `const centerX = 300
  const centerY = 600
  const arcRadius = 500
  const startAngle = -130
  const endAngle = -30`
);

code = code.replace(
  /transform: \`translate\(calc\(40% \+ \$\{panOffset\.x\}px\), calc\(90% \+ \$\{panOffset\.y\}px\)\) scale\(\$\{zoom\}\) rotate\(\$\{-50 - activePoint\.angleDeg\}deg\)\`,/,
  `transform: \`translate(\${panOffset.x}px, \${panOffset.y}px) scale(\${zoom}) rotate(\${-30 - activePoint.angleDeg}deg)\`,`
);

fs.writeFileSync('components/offscript/screens/history.tsx', code);
