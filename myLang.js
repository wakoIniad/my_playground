/**
 * 
 * 問題点リスト
 * 全体的な問題点：
 * エラーを出力する関数が未定義
 * 
 * 個別の問題点：
 * prob1_1,prob1_2: 演算子が空白無しで連続で書かれた場合などへの対応
 */

class Executer {
    constructor(rawText) {
        this .rawText = rawText
        this .excutableOperator = {
            '**':{  
                priority:11,
                len:2,exe:(a,b)=>a**b
            },
            '*':{
                priority:10,
                len:2,exe:(a,b)=>a*b
            },
            '/':{
                priority:10,
                len:2,exe:(a,b)=>a/b
            },
            '%':{
                priority:11,
                len:2,exe:(a,b)=>a%b
            },
            '+':{
                priority:9,
                len:2,exe:(a,b)=>a+b
            },
            '-':{
                priority:9,
                len:2,exe:(a,b)=>a-b
            },
        }
        this .operatorOnParsing = {
            '(':[],
            ')':[]
        }
        this .operatorTokens = [
            ...Object.keys(this.excutableOperator),
            ...Object.keys(this.operatorOnParsing)
        ]
        this .splitted = [];
    }
    to_reversed_poland__(arr) {
        let stack = [];
        const result = [];

        function makeResult() { 
            stack.reverse();
            result.push(...stack);
            return result;
        }
        
        while(arr.length) {
            const e = arr.shift();
            if(e == '(') {
                result.push(...this.to_reversed_poland__(arr));
            } else if(e == ')') {
                return makeResult();
            } else {
                if(e in this.excutableOperator) {
                    const lastStack = stack[stack.length-1];
                    if(lastStack && this.excutableOperator[lastStack].priority >= 
                        this.excutableOperator[e].priority) {
                            result.push(stack.pop())
                            stack.push(e)
                    } else {
                        stack.push(e);
                    }
                } else {
                    result.push(e);
                }
            }
        }
        return makeResult();
    }
    displayError() {

    }

    Parse() {
        return this.to_reversed_poland__(this.split__(this.rawText))
    }

    split__(text) {
        return this.splitted = this.splitter_reviser__(this.splitter__(text));
    }

    //スネークケースで最後に__がついてたら内部用関数
    splitter_reviser__(arr) {
        let regardAsSign = false;
        let result = [];
        let sign = null
        for(const i in arr) {
            const e = arr[i];
            let res_element = e;
            if( e in this.excutableOperator ) {
                //2回以上連続で加算/減算演算子が出てきたら符号として扱う
                if(regardAsSign) {
                    if(e === '+' || e === '-') {
                        if(sign === null) {
                            switch(e) {
                                case '+':
                                    sign = true;
                                    break;
                                case '-':
                                    sign = false;
                                    break;
                            }
                        } else {
                            if(e === '-') {
                                sign = !sign;
                            }
                        }
                        res_element = ''
                    }
                } else {
                    regardAsSign = true;
                }
            } else {
                regardAsSign = false;
                //もし、すでにsignが検出されていたら
                if(sign !== null) {
                    res_element = ( sign ? '+' : '-' ) + e;
                    sign = null;
                }
            }
            if(res_element)result.push(res_element)
        }
        return result;
    }

    splitter__(text) {
        const t = [...text];
        let arrTemp = [];
        let strTemp = "";
        let opTemp = "";
        let mode = null
        //英語復習メモ：前置詞の後にto不定詞は来ない
        let scheduledProcessOnSwitchingMode = () => {}
        let ignoreFunctionalToken = false;

        function pushToken() {
            if(strTemp.length) {
                arrTemp.push(strTemp)
                strTemp = ""
            }
        }

        for (const i in t) {
            const c = ""+t[i];
            //console.log('0123456789'.includes(c) && c,mode,strTemp)
            switch(c) {
                case '\\':
                    if(ignoreFunctionalToken) {
                        strTemp += c;
                        ignoreFunctionalToken = false;
                        break;
                    }
                    ignoreFunctionalToken = true;
                    break;
                case '"':
                    if(ignoreFunctionalToken) {
                        strTemp += c;
                        ignoreFunctionalToken = false;
                        break;
                    }
                    if(mode === 'string') {
                      strTemp += c;
                      pushToken()
                      mode = null
                    } else {
                        scheduledProcessOnSwitchingMode()
                        strTemp+=c;
                        mode = 'string'
                    }
                    break;
                case mode === 'string' && c:
                    strTemp += c;
                    break;
                case ' ':
                    pushToken();
                    mode = null
                    break;
                case '.':
                    if(mode === 'number') {
                        strTemp += c;
                    } else if(mode === 'name') {

                    } else {
                        /* this.displayError() **/
                    }
                    break;
                case '0123456789'.includes(c) && c:
                    if(mode === null) {
                        mode = 'number'
                        strTemp += c;
                    } else if(mode === 'number') {
                        strTemp += c;
                    } else {
                        scheduledProcessOnSwitchingMode()
                        pushToken();
                        mode = 'number';
                        strTemp += c;
                    }
                    break;
                default:
                    if(mode === null) {
                        strTemp += c;
                    } else if(mode === 'operator') {
                        strTemp += c;
                    } else {
                        scheduledProcessOnSwitchingMode()
                        pushToken();
                        strTemp += c;
                    }

                    // #連続した演算子が入力された場合細切れにしていく
                    //=すでにカットした部分は消す！
                    if(this.operatorTokens.includes(strTemp)) {
                        //現時点のものがokなら保存しておく
                        opTemp = strTemp
                    } else {
                        //okじゃなくなった瞬間に以前に保存した
                        //大丈夫なオペレータがあればそれをプッシュする
                        if(opTemp) {
                            //新しいパートを始める
                            strTemp = c;
                            arrTemp.push(opTemp);
                            opTemp = "";
                            if(this.operatorTokens.includes(strTemp)) {
                                opTemp = strTemp
                            } else {
                                /*prob2_1 パース終了時点で存在しない演算子がいないように
                                どこかにエラー処理作る**/
                                /**
                                 * 注意：ここには、できるだけ演算子以外来ないようにする。
                                 * 処理しきれなかったものをここに集めて、無理やり後から処理しようとすると
                                 * おかしくなる
                                 */
                            }
                        } else {
                            /*prob2_2 パース終了時点で存在しない演算子がいないように
                            どこかにエラー処理作る**/
                        }
                    }
                    mode = 'operator';
                    break;
            }
        }
        pushToken()
        return arrTemp;
    }
}

/** 注意：
 * \\\\はjsによって\\になり、
 * 上のプログラムではさらに\になる。
*/

const test = new Executer('(1 + 1)-4 * 2 **- 3 + "aaaa \\"bbb"');
console.log(test.Parse())