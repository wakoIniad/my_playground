const CowaScript = require("./myLang.js");

const sample1 = `
# 1から100までの総和を求めるスクリプト
i = 0;
b = 0;
{   
    i = i + 1;
    b = b + i;
    put ("now Count:"+i);
} while { !(i >= 100) };
put ("sum: " + b);
`;

const sample2 = `
#関数もどき
a = 1;
func = {a = a * 3};
func;
put (a);
func;
put (a);
`
const cowaScript = new CowaScript(sample1);
cowaScript.exe()