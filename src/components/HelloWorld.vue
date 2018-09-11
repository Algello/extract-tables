<template> 
<div class="hello">
    <h1><code>Table crafter v 1.4</code></h1>
    <br>
    <div class="table-container">
        <div v-for="(inform,index) in finalArr" :key="index">
        <pre class="pre-style" v-errorCheck="info">
            {{inform}}
          </pre>
    </div>
    </div>
    <textarea class="textarea" placeholder="Табличный текст сюда..." v-model="rawText" id="textarea" cols="100" rows="10"></textarea>
<div>
    <div class="field">
        <label class="label">Введите начало предложения от которого необходимо избавиться</label>
        <div class="control">
            <input :disabled="!startIsNeeded" class="input" v-model="startAt" type="text" placeholder="Фланец">
        </div>
        <label class="checkbox mr-1">
        <input type="checkbox" v-model="startIsNeeded">
        Есть начало предложения
    </label>
    <label class="checkbox">
        <input type="checkbox" v-model="moreInfoNeeded">
        Есть дополнительный текст в конце
    </label>
    </div>
    <div class="field">
        <label class="label">Введите окончание предложения от которого необходимо избавиться</label>
        <div class="control">
            <input class="input" v-model="endWith" type="text" placeholder="руб шт">
        </div>
    </div>
    <div class="field">
        <label class="label">Введите последние несколько слов из блока описания</label>
        <div class="control">
                <input class="input" v-model="info" type="text" placeholder="Например AISI 304">
            </div>
        </div>
        <div v-show="moreInfoNeeded" class="field">
            <label class="label">Этот отрезок текста будет добавлен в конце описания(необязательно)</label>
            <div class="control">
                <input class="input" v-model="addInfo" type="text" placeholder="Например ГОСТ 12822-80">
            </div>
        </div>
        <div class="field">
            <label class="label">Введите желаемый процент надбавки поверх цены товара (по умолчанию 10%)</label>
            <div class="control">
                <input class="input" v-model.number="perc" type="text" placeholder="Процент наценки...">
            </div>
        </div>
    </div>
    <div class="button-container">
        <button @click="sliceMe" :disabled="!buttonStatus" class="button is-success">Создать таблицу</button>
        <button @click="clearMe" class="button is-danger">Очистить все</button>
    </div>
</div>
</template> 
 
 
<script> 
    export default { 
        data() { 
            return { 
                rawText: "e", 
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
                moreInfoNeeded: false

            } 
        },
        methods: { 
            sliceMe() { 
                let start = this.startAt; 
                let end = this.endWith; 
                let str = this.info; 
                let numb = str.length;
                this.textArray = this.rawText.split(end);
                this.textArray.splice(-1,1); 
                if(this.startIsNeeded) {
                    this.textArray.forEach((item) => { 
                    this.newTextArray.push(item.split(start).pop()); 
                });
                } else {
                  this.textArray.forEach((i)=>{
                    this.newTextArray.push(i);
                  });
                }
                this.newTextArray.forEach((i)=>{ 
                    this.infoArray.push((i.slice(0,i.indexOf(str)+numb)) + this.addInfo);
                    this.priceArray.push(i.split((i.slice(0,i.indexOf(str)+numb))).pop()); 
                }); 
                this.priceArray.forEach((price)=>{
                 let newPrice = parseInt(price.replace(/\s/g,''));
                  this.pricePerc.push(Math.round(newPrice * (this.perc/100)) + newPrice);
                });
                this.superArr = this.infoArray.map((info,i)=>{
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
                this.info = "";
                this.addInfo = "";
                this.perc = 10;
                this.startIsNeeded = true;
                this.superArr = [];
                this.moreInfoNeeded = false;
            } ,
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
                let arr = [];
                this.newTextArray.forEach((i)=>{ 
                    this.infoArray.push((i.slice(0,i.indexOf(str)+numb)) + this.addInfo);
                    this.priceArray.push(i.split((i.slice(0,i.indexOf(str)+numb))).pop()); 
                }); 
                this.priceArray.forEach((price)=>{
                 let newPrice = parseInt(price.replace(/\s/g,''));
                  this.pricePerc.push(Math.round(newPrice * (this.perc/100)) + newPrice);
                });
                this.superArr = this.infoArray.map((info,i)=>{
                  return {
                    info,
                    price: this.pricePerc[i]
                  }
                });
            } 
        },
        computed: {
          finalArr() {
            return this.superArr.map((e)=>{
              return `                <tr>
			        <td style="text-align: center;">
				        ${e.info}</td>
			        <td style="text-align: center;">
				         ${e.price},00 руб</td>
		            </tr>`;
            });
          },
          buttonStatus() {
             if(this.startAt && this.endWith && this.info) {
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
    .mr-1 {
        margin-right: 10px;
    }
    .button-container {
        margin-top: 10px;
    }
    .table-container {
        max-height: 500px;
        overflow-y: auto;
    }
    .is-success {
      margin-right: 5px;
    }
    .pre-style {
        text-align: left;
    }
    .hello { 
 
        padding-top: 30px; 
 
        margin: 0 auto; 

        max-width: 900px;
 
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
 
 
 
 
 