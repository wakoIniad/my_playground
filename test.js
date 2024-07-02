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


const sample3 = `
#関数もどきの実行例
sum_1_to_n = {
#スタックから読み取って指定した名前で保存。
read(n);
i = 1;
result = 0;
{
result = result + i;
i = i + 1;
} while { !(i >= n) };
};
#funcの実行時のスタックに左のオペラントを追加
put(1 >> func);
`

const sample4 = `
#関数もどきの実行例
sum_1_to_n = {
#スタックから読み取って指定した名前で保存。
read(n);
i = 0;
result = 0;
{i = (i + 1);result = (result + i);} while { !(i >= n) };
};
#funcの実行時のスタックに左のオペラントを追加
put(100 >> sum_1_to_n);
`
const test1 = `
i = 1;
a = {
put(i);
j = 1;
put(j);
b = {
put(j);
};
};
a;

b;
`
const cowaScript = new CowaScript(test1);
cowaScript.exe()