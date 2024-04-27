/**
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
        this .calcOperator = {
            '+':[],
            '-':[],
            '*':[],
            '/':[],
        }
        this .operator = {
            '(':[],
            ')':[]
        }
        this .operatorTokens = [
            ...Object.keys(this.operator),
            ...Object.keys(this.calcOperator)
        ]
        this .splitted = [];
    }
    textToReversedPoland(text) {
        splitter(text)
    }
    displayError() {

    }

    Split() {
        return this.splitted = this.splitter_reviser__(this.splitter__(this.rawText));
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
            result.push(res_element)
        }
        return result;
    }

    splitter__(text) {
        const t = [...text];
        let arrTemp = [];
        let strTemp = "";
        let opTemp = "";
        let mode = null

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
                        pushToken();
                        strTemp += c;
                    }
                    if(this.operatorTokens.includes(strTemp)) {
                        //現時点のものがokなら保存しておく
                        opTemp = strTemp
                    } else {
                        //okじゃなくなった瞬間に以前に保存した
                        //大丈夫なオペレータがあればそれをプッシュする
                        if(opTemp) {
                            strTemp = c;
                            arrTemp.push(opTemp);
                            opTemp = "";
                            if(this.operatorTokens.includes(strTemp)) {
                                opTemp = strTemp
                            } else {
                                //なければエラー
                                /*prob1_1 問題点：例えば @=という演算子があるうえで、@という演算子がない場合、
                                エラーになってしまう。修正必須
                                修正案：演算子が存在しない場合でも最初はそのままopTemoに追加し、
                                演算子ではなく数値などの別の要素が出てきたときに
                                保存されている演算子が存在しなければエラーを出す。
                                */
                                //this.displayError();
                            }
                            //なければエラー 2
                            /*prob1_2 同様の問題点：例えば @=という演算子があるうえで、@という演算子がない場合、
                            エラーになってしまう。修正必須
                            */
                        } else {
                            //this.displayError()
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
const test = new Executer('1+ + + - - + -1**2');
console.log(test.Split())