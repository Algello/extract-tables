<template> 
<div class="hello">
    <h3><code>Table crafter v 1.8.1</code></h3>
    <br>
    <div class="table-container">
        <div v-for="(inform,index) in finalArr" :key="index">
            <pre class="pre-style" v-errorCheck="info">
            {{inform}}
          </pre>
        </div>
    </div>
    <textarea class="textarea" placeholder="Табличный текст сюда..." v-model="rawText" id="textarea" cols="100" rows="10"></textarea>
    <div class="fields-container">
        <div class="some-fields" :class="{gone: isHidden}">
            <div class="field">
                <div class="control">
                    <input :disabled="!startIsNeeded" class="input" v-model="startAt" type="text" placeholder="Фланец">
                </div>
                <p class="help" :class="{'is-success': startAt}">Введите начало предложения от которого необходимо избавиться</p>
            </div>
            <div class="field">
                <div class="control">
                    <input class="input" v-model="endWith" type="text" placeholder="руб шт">
                </div>
                <p class="help" :class="{'is-success': endWith}">Введите окончание предложения от которого необходимо избавиться</p>
            </div>
            <div class="field">
                <div class="control">
                    <input class="input" v-model="info" @change="checkArr" type="text" placeholder="Например AISI 304">
                </div>
                <p class="help" v-if="!duplicate" :class="{'is-success': info}">Введите последние несколько слов из блока описания</p>
                <p class="help is-danger" v-else>Внимание, найден повторяющийся ключ.</p>
            </div>
            <div class="field">
                <div class="control">
                    <input class="input" :disabled="!moreInfoNeeded" v-model="addInfo" type="text" placeholder="Например ГОСТ 12822-80">
                </div>
                <p class="help" :class="{'is-success': addInfo}">Этот отрезок текста будет добавлен в конце описания(необязательно)</p>
            </div>
            <div class="field">
                <div class="control">
                    <input class="input" v-model.number="perc" type="text" placeholder="Процент наценки...">
                </div>
                <p class="help">Введите желаемый процент надбавки поверх цены товара (по умолчанию 10%)</p>
            </div>
            <div class="button-container">
        <button @click="sliceMe" :disabled="!buttonStatus" class="button is-success">Создать таблицу</button>
        <button @click="clearMe" class="button is-danger">Очистить</button>
        <button @click="toggleSettings" class="button is-warning">Настройки</button>
    </div>
        </div>
        <!--end of fields-->
        <div class="settings box" :class="{begone: isHidden}">
            <div class="delete-btn"><button class="delete is-small" @click="toggleSettings"></button></div>
            <label class="checkbox mr-1">
                <input type="checkbox" v-model="startIsNeeded">
                Есть начало предложения
            </label>
            <label class="checkbox">
                <input type="checkbox" v-model="moreInfoNeeded">
                Есть текст в конце
            </label>
            <div class="field">
                <label class="label">Разделитель</label>
                <div class="control">
                    <div class="select">
                        <select v-model="divider">
                            <option>/</option>
                            <option>,</option>
                            <option>=</option>
                        </select>
                    </div>
                </div>
            </div>
            <hr>
            <div class="stats content">
                <p>Ошибки: <span class="tag" :class="{'is-danger': errorCount}">{{errorCount}}</span></p>
                <p>Всего строк: <span class="tag">{{totalStrings}}</span></p>
                <p>Строк сгенерировано: <span class="tag" :class="{'is-danger': countGenerated !== totalStrings}">{{countGenerated}}</span></p>
            </div>
        </div>
    </div>
</div>
</template> 
 
 
<script> 
    export default {
        data() {
            return {
                rawText: "",
                textArray: [],
                newTextArray: [],
                infoArray: [],
                priceArray: [],
                pricePerc: [],
                startAt: "",
                endWith: "",
                info: "",
                addInfo: "",
                perc: 10,
                startIsNeeded: true,
                superArr: [],
                moreInfoNeeded: false,
                divider: '/',
                isHidden: true,
                duplicate: false,
                totalStrings: 0,
                errorCount: 0,
                countGenerated: 0
            }
        },
        methods: {
            sliceMe() {
                let start = this.startAt;
                let end = this.endWith;
                let str = this.info;
                let numb = str.length;
                this.textArray = this.rawText.split(end);
                this.textArray.splice(-1, 1);
                this.totalStrings = this.textArray.length;
                if (this.startIsNeeded) {
                    this.textArray.forEach((item) => {
                        this.newTextArray.push(item.split(start).pop());
                    });
                } else {
                    this.textArray.forEach((i) => {
                        this.newTextArray.push(i);
                    });
                }
                this.fillInfoArr();
                this.priceArray.forEach((price) => {
                    let newPrice = parseInt(price.replace(/\s/g, ''));
                    if (newPrice === NaN) {
                        this.errorCount++;
                    }
                    this.pricePerc.push(Math.round(newPrice * (this.perc / 100)) + newPrice);
                });
                this.superArr = this.infoArray.map((info, i) => {
                    return {
                        info,
                        price: this.pricePerc[i]
                    }
                });
            },
            clearMe() {
                this.rawText = "";
                this.textArray = [];
                this.newTextArray = [];
                this.infoArray = [];
                this.priceArray = [];
                this.pricePerc = [];
                this.startAt = "";
                this.endWith = "";
                this.addInfo = "";
                this.startIsNeeded = true;
                this.superArr = [];
                this.moreInfoNeeded = false;
                this.isHidden = false;
                this.duplicate = false;
                this.errorCount = 0;
                this.countGenerated = 0;
                this.totalStrings = 0;
            },
            // regMe() { 
            //     let endOfString = this.regInfo; 
            //     console.log(endOfString); 
            //     console.log(typeof `/.*(${endOfString})/`); 
            //     console.log(/.*(12821-80)/); 
            //     let reg = "/.*(12821-80)/"; 
            //     this.newTextArray.forEach((i)=>{ 
            //         this.infoArray.push(i.match(new RegExp(reg))[0]); 
            //     }); 
            // }, 
            tagMe() {
                let str = this.info;
                let numb = str.length;
                this.newTextArray.forEach((i) => {
                    this.infoArray.push((i.slice(0, i.indexOf(this.info) + numb)) + this.addInfo);
                    this.priceArray.push(i.split((i.slice(0, i.indexOf(str) + numb))).pop());
                    this.countGenerated++;
                });
                this.priceArray.forEach((price) => {
                    let newPrice = parseInt(price.replace(/\s/g, ''));
                    if (newPrice === NaN) {
                        this.errorCount++;
                    }
                    this.pricePerc.push(Math.round(newPrice * (this.perc / 100)) + newPrice);
                });
                this.superArr = this.infoArray.map((info, i) => {
                    return {
                        info,
                        price: this.pricePerc[i]
                    }
                });
            },
            fillInfoArr() {
                //took all strings
                let allStrings = this.info.split(this.divider);
                //for each of those create array and delete another strings
                allStrings.forEach((smallStr) => {
                    this.newTextArray.forEach((bigStr) => {
                        if (bigStr.includes(smallStr)) {
                            this.infoArray.push((bigStr.slice(0, bigStr.indexOf(smallStr) + smallStr.length)) + this.addInfo);
                            this.priceArray.push(bigStr.split((bigStr.slice(0, bigStr.indexOf(smallStr) + smallStr.length))).pop());
                            this.countGenerated++;
                        }
                    });
                });
            },
            toggleSettings() {
                this.isHidden = !this.isHidden;
            },
            checkArr() {
                this.duplicate = false;
                let hasDuplicates = function (a) {
                    let counts = [];
                    for (let i = 0; i <= a.length; i++) {
                        if (counts[a[i]] === undefined) {
                            counts[a[i]] = 1;
                        } else {
                            return true;
                        }
                    }
                    return false;
                }
                let startArr = this.info.split(this.divider);
                if (hasDuplicates(startArr)) {
                    this.duplicate = true;
                }
            }
        },
        computed: {
            finalArr() {
                return this.superArr.map((e) => {
                    return `                <tr>
			        <td style="text-align: center;">
				        ${e.info}</td>
			        <td style="text-align: center;">
				         ${e.price},00 руб</td>
		            </tr>`;
                });
            },
            buttonStatus() {
                if (this.startAt && this.endWith && this.info) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
</script> 
 
 
<!-- Add "scoped" attribute to limit CSS to this component only --> 
 
<style scoped lang="scss"> 
    .some-fields {
        transition: all .5s;
        flex: 1;
        margin-top: 33px;
    }
    .gone {
        flex: 0 0 100% !important;
    }
    .begone {
        transform: scale(0) !important;
    }
    .delete-btn {
        text-align: right;
    }
    .mr-1 {
        margin-right: 10px;
    }
    .button-container {
        margin-top: 10px;
        & > * {
            margin-right: 15px;
        }
    }
    .table-container {
        max-height: 500px;
        overflow-y: auto;
    }
    .pre-style {
        text-align: left;
    }
    .hello { 
 
        padding-top: 30px; 
 
        margin: 0 auto; 

        max-width: 900px;
 
    } 
    .fields-container {
        display: flex;
    }
    .settings {
        position: relative;
        flex: 0 0 30%;
        text-align: left;
        margin-left: 15px;
        margin-top: 33px;
        transition: all .5s;
        transform: scale(1);
    }
    .settings > * {
        margin-bottom: 10px;
    }
    h3 { 
 
        margin: 40px 0 0; 
 
    } 
 
    ul { 
 
        list-style-type: none; 
 
        padding: 0; 
 
    } 
 
    li { 
 
        display: inline-block; 
 
        margin: 0 10px; 
 
    } 
 
    a { 
 
        color: #42b983; 
 
    } 
 
</style> 
 
 
 
 
 