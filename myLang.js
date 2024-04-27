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
            '+':{priority:10},
            '-':{priority:10},
            '*':{priority:9},
            '/':{priority:9},
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
        while(arr.length) {
            const e = arr.shift();
            const lastStack = stack[stack.length-1];
            if(e == '(') {
                result.push(...this.to_reversed_poland__(arr));
            } else if(e == ')') {
                return result;
            } else {
                if(this.operatorTokens.includes(e)) {
                    if(this.excutableOperator[lastStack].priority <= 
                        this.excutableOperator[e].priority) {
                            result.push(stack.pop())
                    } else {
                        stack.push(e);
                    }
                } else {
                    result.push(e);
                }
            }
        }
        stack.reverse();
        result.push(...stack);
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
            if( e === '+' || e === '-' ) {
                //2回以上連続で加算/減算演算子が出てきたら符号として扱う
                if(regardAsSign) {
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
                case '"':
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

/** */
const test = new Executer('1+ + +- - + -1**2');
console.log(test.Parse())