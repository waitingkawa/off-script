const fs = require('fs');
let code = fs.readFileSync('components/offscript/screens/history.tsx', 'utf8');

code = code.replace(
  /className="absolute -translate-x-1\/2 -translate-y-1\/2 transition-transform duration-300"\s+style={{ left: \`\$\{pt\.x\}px\`, top: \`\$\{pt\.y\}px\` }}/m,
  `className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
                  style={{ left: \`\${pt.x}px\`, top: \`\${pt.y}px\`, transform: \`translate(-50%, -50%) rotate(\${50 + activePoint.angleDeg}deg)\` }}`
);

fs.writeFileSync('components/offscript/screens/history.tsx', code);
