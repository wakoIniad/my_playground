Node.jsのリハビリ的な目的で作ったプログラムです。
ちゃんと動く保証は全くないです。
というか、まともに動かない場面がかなり多いと思います。

例
```py
# 1から100までの総和を求めるスクリプト
# これは動きます
i = 0;
b = 0;
{   
    i = i + 1;
    b = b + i;
    put ("now Count:"+i);
} while { !(i >= 100) };
put ("sum: " + b);
```

演算子一覧
```+ - * / % ** > < >= <= =```: 使い方は見た目の通りです。

独特な書き方

- if,while文
```py
  {a > 1} if {put("a is larger than 1")}
  {i < 100} while {put(i)}
```
自分のプログラミング力が低すぎて、こういう順番の処理しか作れませんでした。

（この位置なら、*とか+とかなどの普通の演算子と同じような処理で作れる）

- ブロック (???) 文
  基本的に計算は、読み込まれた時点で実行されてしまいます。
  
  if文の条件や、中身など、読み込まれては困るものは`{ ... }`で囲んでください。
```py
#こういう使い方もできます(関数もどき)
func = {put ("hello")}
func;func;
```

- put "演算子"について

まるで関数のような見た目で実行されていますが、

put演算子の優先順位をめちゃくちゃ低くして、被演算子をかっこで囲まないとまともに動かないようにしてるだけです()

