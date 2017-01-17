var goods = [{key: 1, summ: 15900, 
            img: './ingatorp.jpg', name:'Стол Ингартоп', amount: 3},
            {key: 2, summ: 2000, img: './linnmon.jpg', name: 'Стол Линнмон', amount: 5},
             {key: 3, summ: 3000, img: './ingol.jpg', name: 'Стул Ингольф', amount: 10},
            {key: 4, summ: 1500, img: './ivar.jpg', name: 'Стул Ивар', amount: 20}];

// создать новый элемент
function newElement (tag, className, content){
    if (tag == 'div') {
        elem = document.createElement('div');
        elem.className = className;
        text = document.createTextNode(content);
        elem.appendChild(text)
    }
    if (tag == 'img') {
        elem = document.createElement('img');
        elem.className = className;
        elem.src = content;        
    } 
    if (tag == 'p') {
        elem = document.createElement('p');
        elem.className = className;
        text = document.createTextNode(content);
        elem.appendChild(text)
    } 
    if (tag == 'button') {
        elem = document.createElement('button');
        elem.className = className;
        text = document.createTextNode(content);
        elem.appendChild(text)
    }
    return elem
};

// доп текст для карточки товара (указание атрибута)
function additionalText (ind) {
    if (ind == 'key') {
        text = 'номер товара: ';
    }
    if (ind == 'summ') {
        text = 'Стоимость 1шт: ';
    }
    if (ind == 'img') {
        text = '';
    }
    if (ind == 'name') {
        text = 'Наименование: ';
    }
    if (ind == 'amount') {
        text = 'Количество: ';
    }
    return text
};


var goodsField = document.getElementById('goods_field');
var basketField = document.getElementById('basket_field');

// выводит карточку 1 товара
function goodsBox(index) {
    var oneGood = newElement('div', 'oneGood', '')
    for (key in goods[index]) {
        oneGood.id = goods[index].key
        if (key != 'img') {
            goodsItem = newElement ('div', key, additionalText(key) + goods[index][key]);
        } else {
            goodsItem = newElement ('img', key, additionalText(key) + goods[index][key]);
        }
        relation (oneGood, goodsItem);
        relation (goodsField, oneGood)              
    }
    addBuyButton(oneGood);
}

// добавить кнопку покупки в карточку товара
function addBuyButton(oneGood) {
    var buyButton = newElement('button', 'buyButton', 'Добавить');
    relation (oneGood, buyButton);
}

// функция для выведения всех товаров на страницу
function showGoods () {
    for (i in goods) {
        goodsBox(i)
    }
}

// выводим все товары на страницу
showGoods()

//доп функция для родительских связей 
function relation (parent, child) { 
    parent.appendChild(child);    
}

var basket = [];
var buy = document.getElementsByClassName('buyButton');

// добавляем товар в корзину по щелчку на кнопку 'Добавить'
// при этом обновляем корзину и количество товара в списке товаров
function buyGood() {
    for (var i=0; i<buy.length; i++) {
        buy[i].addEventListener('click', addToBasket);
        buy[i].addEventListener('click', showBasket);
    }
}
buyGood()

// функция копирования массива
function arrCopy(arr) {
    arrNewCopy = JSON.parse(JSON.stringify(arr));
    return arrNewCopy
}

// функция добавления товара в корзину(в массив)
function addToBasket() {
    for (i in goods) {
        if (goods[i].amount > 0) {            
            if (event.target.parentNode.id == goods[i].key) {
                var copyGoods = arrCopy(goods[i]);
                if (basket.length == 0) {                    
                    basket.push(copyGoods);
                    basket[0].amount = 1;                    
                } else {
                    var check = 0;
                    for (j in basket) {
                        if (basket[j].key == goods[i].key) {
                            basket[j].amount += 1; 
                        } 
                        else {
                            check += 1;
                        }  
                        if (check == basket.length) {
                            basket.push(copyGoods);
                            basket[(basket.length-1)].amount = 1; 
                        }                        
                    }                                        
                }                
                goods[i].amount -= 1;  
                refreshGoods(i)
            }
        }
    }     
}

// функция обновления количества оставшегося товара на странице с товарами
function refreshGoods(){
    goodsField.innerHTML = '';
    showGoods();
    buyGood()    
}

// функция подсчёта итоговой суммы корзины
function countBasketSum() {
    var count = 0;
    for (i in basket) {
        count += basket[i]['summ'] * basket[i]['amount']
    }
    return count
}


// отображение корзины на экране
function basketBox(index) {
    var oneBasketGood = newElement('div', 'oneBasketGood', '')
    for (key in basket[index]) {
        if (key == 'key') {
            basketItem = newElement ('div', '', '');   oneBasketGood.id = basket[index][key] + basket         
        } 
        else 
            if (key != 'img') {
            basketItem = newElement ('div', key + '_basket', additionalText(key) + basket[index][key]);            
        } 
        else {  
             basketItem = newElement ('img', key + '_basket', additionalText(key) + basket[index][key]);  
        }                
        relation (oneBasketGood, basketItem);        
        relation (basketField, oneBasketGood);
    }    
    var exit = newElement('div', 'exit', '');
    relation (oneBasketGood, exit);
    
}


// обновление корзины
function showBasket () { 
    basketField.innerHTML = '';
    for (i in basket) {        
        basketBox(i)
    }
    var basketFinalSum = newElement('div', 'basket_final_sum', 'Итоговая сумма: ' + countBasketSum());
    relation (basketField, basketFinalSum);
}

// функция удаления элемента из корзины(из массива)
function deleteGood(index) {    
    for (i in basket) {
        if (basket[i].key == index) {
            basket.splice(i, 1);                
        }
    } 
    
}

// функция возвращающая изначальное количество товара в списке товаров, при удалении его из корзины
function refreshGoodsAmount(index) {
    for (i in basket) {
        if (basket[i].key == index) {
            goods[index-1].amount += basket[i].amount 
        }
    }
}

// для визуального удаления элемента из корзины при нажатии на х
basketField.addEventListener('click', function(){
    if (event.target.className == 'exit') {  
        basketField.removeChild(event.target.parentNode);
        var goodId = parseInt(event.target.parentNode.id);
        refreshGoodsAmount(goodId);
        deleteGood(goodId);
        refreshGoods();
        showBasket();
    }
});




