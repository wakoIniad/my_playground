const CowaScript = require("./myLang.js");
const cowaScript = new CowaScript(
  `# 1から100までの総和を求めるスクリプト
  i = 0;
  b = 0;
  {   
      i = i + 1;
      b = b + i;
      put ("now Count:"+i);
  } while { !(i >= 100) };
  put b;
`);
console.log(cowaScript.exe())