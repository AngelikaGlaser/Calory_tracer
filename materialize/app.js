//Storage Controller
const StorageCtrl = (function (){
    //public method
    return {
        storeItem: function (item){
            let items;
            //check for items in LS
            if(localStorage.getItem('items') === null){
                items = [];
                //push new item
                items.push(item);
                // set ls
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                //get whats in LS
                items = JSON.parse(localStorage.getItem('items'));
                // push new item
                items.push(item);
                //reset ls
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function (){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemInStorage: function (updatedItem){
            let items
            if(localStorage.getItem('items') === null){
                items = []
            } else {
                items = JSON.parse(localStorage.getItem('items'))
            }
            items.forEach(function (itemsFromStorage, index){
                if(itemsFromStorage.id === updatedItem.id){
                    items.splice(index, 1, updatedItem)
                }
            })
            localStorage.setItem('items', JSON.stringify(items))
            console.log(items)
        }
    }
}) ();

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
        total: 0,
        currentItem: null
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
        getItem: function (id){
            let found = null
            data.items.forEach(function (item){
                if(item.id === id){
                    found = item
                }
            })
            return found
        },
        setCurrentItem: function (item){
            data.currentItem = item
        },
        getCurrentItem: function (){
          return data.currentItem
        },
        updateItem: function (name, calories) {
            let updated = null
            data.items.forEach(function (item) {
                if (item.id === data.currentItem.id){
                    item.name = name
                    item.calories = parseInt(calories)
                    updated = item
                }
            })
            return updated
        },

        getTotalCalories: function (){
          let total = 0;
          //loop through all the items and add calories
            data.items.forEach(function (item){
                total = total + item.calories;
            });
            // set total calories in data structure
            data.total = total;
            //return total
            return data.total;
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
        listOfItems: '#item-list li',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        addBtn: '.add-btn',
        totalCalories: '.total-calories',
        updateMeal: '.update-btn'
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
        },
        showTotalCalories: function (totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        showUpdatedMealBtn: function (){
            document.querySelector(UISelectors.addBtn).style.display = 'none'
            document.querySelector(UISelectors.updateMeal).style.display = 'inline'
        },
        clearEditState: function (){
            document.querySelector(UISelectors.addBtn).style.display = 'inline'
            document.querySelector(UISelectors.updateMeal).style.display = 'none'
        },
        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories
            UICtrl.showUpdatedMealBtn()
        },
        updateItem: function (item) {
            let listOfItems = document.querySelectorAll(UISelectors.listOfItems)
            listOfItems.forEach(function (listItem) {
                let listItemId = listItem.getAttribute('id')
                if(listItemId === `item-${item.id}`){
                    document.querySelector(`#item-${item.id}`).innerHTML = `<strong>${item.name}</strong>
                            <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>`
                }
            })
        }
    }
}) ();

//App Controller

const App = (function(ItemCtrl, StorageCtrl, UICtrl){
    //load event listeners
    const loadEventListeners = function (){
        //get event listeners
        const UISelectors = UICtrl.getSelectors();
        //add item event
        document.querySelector(UISelectors.addBtn).
            addEventListener('click', itemAddSubmit);
        //update button event
        document.querySelector(UISelectors.updateMeal).addEventListener('click', itemUpdateSubmit)
        //item edit submit
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditSubmit)
        //add document reload event
        document.addEventListener('DOMContentLoaded', getItemsFromStorage)
    }
    //item add submit function
    const itemAddSubmit = function(event){
        const input = UICtrl.getItemInput()
        //check for name and calorie input
        if(input.name !== '' && input.calories !== ''){
            const newItem = ItemCtrl.addItem(input.name, input.calories)
            //add item to UI items list
            UICtrl.addListItem(newItem);
            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            //store in LS
            StorageCtrl.storeItem(newItem);
            //clear fields
            UICtrl.clearInput();

        }
        event.preventDefault()
    }
    //get items from storage
    const getItemsFromStorage = function (){
        // get items from LS
        const items = StorageCtrl.getItemsFromStorage();
        //set storage items to ItemCtrl data items
        items.forEach(function (item){
            ItemCtrl.addItem(item['name'], item['calories'])
        })
        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add total calories to UI
        UICtrl.showTotalCalories(totalCalories);
        //populate items list
        UICtrl.populateItemList(items);
    }

    const itemEditSubmit = function (event) {
        if(event.target.classList.contains('edit-item')){
            const listID = event.target.parentNode.parentNode.id
            const listIDArray = listID.split('-')
            const id = parseInt(listIDArray[1])
            const itemToEdit = ItemCtrl.getItem(id)
            ItemCtrl.setCurrentItem(itemToEdit)
            UICtrl.addItemToForm()
        }
    }

    const itemUpdateSubmit = function (){
        const input = UICtrl.getItemInput()
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories)
        UICtrl.updateItem(updatedItem)
        StorageCtrl.updateItemInStorage(updatedItem)
        const totalCalories = ItemCtrl.getTotalCalories()
        UICtrl.showTotalCalories(totalCalories)
        UICtrl.clearInput()
        UICtrl.clearEditState()
        event.preventDefault()
    }

    return {
        init: function (){
            //fetch items from data structure
            const items = ItemCtrl.getItems()
            //populate items list
            UICtrl.populateItemList(items)
            //load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl)

//Initialize App
App.init()
