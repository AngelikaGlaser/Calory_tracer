//Storage Controller
//creat later

//item controller
const ItemCtrl = (function(){
    //Item constructor
    const Item = function (id, name, calories){
        this.id = id
        this.name = name
        this.calories = calories
    }

    // Data Structure
    const data = {
        items: [
           // {id: 0, name: 'Steak Dinner', calories: 1200},
            //{id: 1, name: 'Cookie', calories: 400},
            //{id: 2, name: 'Eggs', calories: 300}
        ],
        total: 0
    }

    return {
        getItems: function (){
            return data.items
        },
        addItem: function (name, calories){
            let ID
            //create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id+1
                console.log(ID)
            }
            else{
                ID = 0
            }
            //calories to numbers
            calories = parseInt(calories);
            //create new item
            newItem = new Item(ID, name, calories);
            //add to items array
            data.items.push(newItem);
            //return new item
            return newItem
        },
        logData: function(){
            return data
        }
    }
}) ();

//UI Controller
const UICtrl = (function (){
    //UI Selector
    const UISelectors = {
        itemList: '#item-list',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        addBtn: '.add-btn'
    }
    return{
        populateItemList: function (items){
            //Create HTML content
            let html = '';

            //parse data and create list items html
            items.forEach(function (item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
                </li>`;
            });
            // insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getSelectors: function (){
            return UISelectors
        },
        getItemInput: function (){
            return{
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function (item){
            // create li element
            const li = document.createElement('li');
            //add class
            li.className = 'collection-item';
            //add ID
            li.id = `item-${item.id}`;
            // add HTML
            li.innerHTML = `<strong>${item.name}:</strong>
               <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>`;
            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        clearInput: function (){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        }
    }
}) ();

//App Controller

const App = (function(ItemCtrl, UICtrl){
    //load event listeners
    const loadEventListeners = function (){
        //get event listeners
        const UISelectors = UICtrl.getSelectors();
        //add item event
        document.querySelector(UISelectors.addBtn).
            addEventListener('click', itemAddSubmit);
    }
    //item add submit function
    const itemAddSubmit = function(event){
        const input = UICtrl.getItemInput()
        //check for name and calorie input
        if(input.name !== '' && input.calories !== ''){
            const newItem = ItemCtrl.addItem(input.name, input.calories)
            //add item to UI items list
            UICtrl.addListItem(newItem)
            //clear fields
            UICtrl.clearInput();

        }
        event.preventDefault()
    }

    return {
        init: function (){
            console.log('Initializing App')
            //fetch items from data structure
            const items = ItemCtrl.getItems()
            //populate items list
            UICtrl.populateItemList(items)
            //load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl)

//Initialize App
App.init()
