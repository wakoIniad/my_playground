class Executer {

    constructor(process) {
        this.process = process;
        this.readLineAt = 0;
        this.readWordAt = 0;
        this .valueNames = {
            'true':true,'false':false
        }
        this .excutableOperator = {
            '>>':{
                len:2,exe:(a,b)=> this.val_parse__(b,a)
            },
            '**':{  
                len:2,exe:(a,b)=>this.val_parse__(a)**this.val_parse__(b)
            },
            '*':{
                len:2,exe:(a,b)=>this.val_parse__(a)*this.val_parse__(b)
            },
            '/':{
                len:2,exe:(a,b)=>this.val_parse__(a)/this.val_parse__(b)
            },
            '%':{
                len:2,exe:(a,b)=>this.val_parse__(a)%this.val_parse__(b)
            },
            '+':{
                len:2,exe:(a,b)=>this.val_parse__(a)+this.val_parse__(b)
            },
            '-':{
                len:2,exe:(a,b)=>this.val_parse__(a)-this.val_parse__(b)
            },
            '!': {
                len:1,exe:(a)=>!this.val_parse__(a)
            },
            '>':{
                len:2,exe:(a,b)=>this.val_parse__(a)>this.val_parse__(b)
            },
            '<':{
                len:2,exe:(a,b)=>this.val_parse__(a)<this.val_parse__(b)
            },
            '>=':{
                len:2,exe:(a,b)=>this.val_parse__(a)>=this.val_parse__(b)
            },
            '<=':{
                len:2,exe:(a,b)=>this.val_parse__(a)<=this.val_parse__(b)
            },
            '=': {
                len:2, exe:(a,b)=> {
                    this.data[a] = b;
                    return b;
                }
            },
            'if': {
                len:2, exe:(a,b) => {
                    if(this.val_parse__(b)) {
                        return this.val_parse__(a)
                    }
                }
            },
            'while': {
                len:2, exe:(a,b) => {
                    let res;
                    while(this.val_parse__(b)) {
                        res = this.val_parse__(a)
                    }
                    return res;
                }
            },
            'put': {
                len:1, exe:(a) => {
                    let res = this.val_parse__(a);
                    console.log(JSON.stringify(res))
                    return res;
                }
            },
            'readas': {
                len:2, exe:(a,b)=> {
                    console.log(a,b)
                    this.data[b] = a;
                    return b;
                }
            }
        }
        this .operatorOnParsing = {
            '(':[],
            ')':[],
            ';':[]
        }
        this .operatorTokens = [
            ...Object.keys(this.excutableOperator),
            ...Object.keys(this.operatorOnParsing)
        ]

        this .data = {};
    }

    displayExcuterError(code,v) {
        const msg = [
            v + ' is not defined'
        ]
        const error = new Error(msg[code])
        error.name = 'Executer Error'
        throw error
    }

    isNumber(text) {
        let textArr = [...text];
        let position = 'first'
        let pointted = false;
        while(textArr.length) {
            const c = textArr.shift();
            if(position === 'first') {
                if(!'-+0123456789'.includes(c)) return false;
                position = 'middle'
            } else if(position === 'middle') {
                if(!'0123456789'.includes(c)) {
                    if(!pointted && c == '.') {
                        pointted = true;
                    } else {
                        return false
                    }
                }
            }
        }
        return true;
    }

    isVariable(text) {
        let textArr = [...text]
        let position = 'start'
        while(textArr.length) {
            const c = textArr.shift()
            if(65 < c.charCodeAt() && 122 > c.charCodeAt() || '_$'.includes(c)) {
                if(position === 'start' )position = 'middle';
            } else if(position !== 'start') {
                if(!'0123456789'.includes(c)) return false;
            } else return false;
        }
        return true;
    }

    /**これは演算子の処理の中でのみ使う */
    val_parse__(text,...args){
        if(text.startsWith('"') && text.endsWith('"')) {
            return text.slice(1,text.length-1);
        } else if(text.startsWith('{') && text.endsWith('}')){
            const parser = new Parser(text.slice(1,text.length-1))
            parser.Parse();
            
            return this.Execute(parser.parsed,...args);
        }   else if(text in this.valueNames){
            return this.valueNames[text];
        } else if(this.isNumber(text)) {
            return (+text);
        } else if(this.isVariable(text)) {
            const val = this.data[text];
            if(val === undefined)this.displayExcuterError(0,text)
            return this.val_parse__(val,...args);
        }
    }

    /**Execute per line */
    Execute(process = this.process,...args) {
        let result;
        for(const i in process) {
            const line = process[i];
            result = this.executer__(line,...args)
            this.readLineAt = i
        }
        return result;
    }

    executer__(arr,...optionalArgs) {
        const stack = [...optionalArgs];
        for(const i in arr) {
            this.readWordAt = i
            const e = arr[i];
            if(e in this.excutableOperator) {
                const operatorClass = this.excutableOperator[e]
                const requiredArgsLen = operatorClass.len;
                const args = stack.splice(stack.length-requiredArgsLen)
                /**nameが返ってくることは想定していない */
                stack.push(JSON.stringify(operatorClass.exe(...args)))
            } else {
                stack.push(e)
            }
        }
        return this.val_parse__(stack.pop());
    }
}

class Parser {
    constructor(rawText) {
        this .rawText = rawText
        this .readAt = 0;

        /**
         * prob3
         * 変数名と解釈して、変数名と統合するかどうか
         */
        this .excutableOperator = {
            'readas': {
                priority:13
            },
            'put': {
                priority:13
            },
            '!': {
                priority:12
            },
            '**':{  
                priority:11,
            },
            '*':{
                priority:10,
            },
            '/':{
                priority:10,
            },
            '%':{
                priority:11,
            },
            '+':{
                priority:9,
            },
            '-':{
                priority:9,
            },
            '>':{
                priority:8,
            },
            '<':{
                priority:8,
            },
            '>=':{
                priority:8,
            },
            '<=':{
                priority:8,
            },
            '=': {
                priority:2
            },
            ">>": {
                priority:2
            },
            'if': {
                priority:1 
            },
            'while': {
                priority:1 
            }
        }
        this .operatorOnParsing = {
            '(':[],
            ')':[],
            ';':[]
        }
        this .operatorTokens = [
            ...Object.keys(this.excutableOperator),
            ...Object.keys(this.operatorOnParsing)
        ]

        this .parsed = [];

        this .data = {};
    }

    set script(text) {
        this.rawText = text
    }

    isCharacterForName(c) {
        return 65 < c.charCodeAt() && 122 > c.charCodeAt() || '_$'.includes(c)
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

    displayParserError() {

    }

    

    Parse() {
        this.parsed = []
        while(this.readAt < this.rawText.length) {
            const splitted = this.split__(this.rawText);
            if(!splitted.length)continue
            if(splitted[0][0] == '#')continue;
            this.parsed.push(this.to_reversed_poland__(splitted));
        }
        return this.parsed;
    }

    split__(text) {
        return this.splitter_reviser__(this.splitter__(text));
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
                //もし、すでにsignが検出されていたら次に追加する
                if(sign !== null) {
                    res_element = ( sign ? '+' : '-' ) + e;
                    sign = null;
                }
            }
            if(res_element)result.push(res_element)
        }
        return result;
    }

    /**テキストか配列 */
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

        let blockDepth = 0;
        for(;this.readAt < this.rawText.length; this.readAt++) {
            const c = ""+t[this.readAt];
            switch(c) {
                case '}':    
                    strTemp+=c;
                    //pushToken();
                    //mode = null
                    blockDepth--;
                    if(blockDepth === 0) {
                        pushToken();
                        mode = null;
                    }
                    break;
                case mode === 'block' && c:
                    if(c === "{") {
                        blockDepth++;
                    }
                    strTemp += c;
                    break;
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
                        pushToken()
                        strTemp+=c;
                        mode = 'string'
                    }
                    break;
                case mode === 'string' && c:
                    strTemp += c;
                    break;
                
                case '{':
                    scheduledProcessOnSwitchingMode()
                    pushToken();
                    strTemp+=c;
                    mode = 'block'
                    blockDepth++;
                    break;
                case '\n':
                    if(ignoreFunctionalToken) {
                        ignoreFunctionalToken = false;
                        break;
                    }
                    this.readAt++;
                    pushToken()
                    return arrTemp;  
                case ';':
                    this.readAt++;
                    pushToken()
                    return arrTemp;
                case ' ':
                    pushToken();
                    mode = null
                    break;
                case '.':
                    if(mode === 'number') {
                        strTemp += c;
                    } else if(mode === 'name') {

                    } else {
                        /* this.displayParserError() **/
                    }
                    break;
                
                case this.isCharacterForName(c) && c:
                    if(mode === null) {
                        mode = 'name'
                        strTemp += c;
                    } else if(mode === 'name') {
                        strTemp += c;
                    } else {
                        scheduledProcessOnSwitchingMode()
                        pushToken();
                        mode = 'name';
                        strTemp += c;
                    }
                    break;
                case '0123456789'.includes(c) && c:
                    if(mode === 'name') {
                        strTemp += c
                    } else if(mode === null) {
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

                    // #連続して演算子が入力された場合、解釈できる最大長で細切れにしていく
                    if(this.operatorTokens.includes(strTemp)) {
                        //現時点のものがokなら保存しておく
                        opTemp = strTemp
                    } else {
                        //okじゃなくなった瞬間に以前に保存した
                        //okなオペレータがあればそれをプッシュする
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
                                 * 処理しきれなかったものをここに集めて、無理やり後から処理しようとするのは
                                 * 無駄に複雑になるのでダメ
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

class CowaScript {
    constructor(script) {
        this.rawScript = script
        this.parser__ = new Parser();
        this.parser__.script = this.rawScript;

    }
    exe() {
        this.parser__.Parse()
        const excuter = new Executer(this.parser__.parsed);
        return excuter.Execute();
    }
}

module.exports = CowaScript;



/**
 * 
 * 超重要：
 *
 * 文字列の中にある場合、ブロック型の対応を変更！！
 */
