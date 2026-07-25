const fs = require('fs');
let code = fs.readFileSync('components/offscript/screens/history.tsx', 'utf8');

code = code.replace(
  /rotate\(\$\{50 \+ activePoint\.angleDeg\}deg\)/,
  `rotate(\${30 + activePoint.angleDeg}deg)`
);

fs.writeFileSync('components/offscript/screens/history.tsx', code);
