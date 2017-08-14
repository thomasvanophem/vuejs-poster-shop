var LOAD_NUM = 10;

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        result: [],
        cart: [],
        searchFor: 'sports',
        lastSearch: '',
        loading: true,
        price: 9.99
    },
    methods: {
        appendItems: function() {
            if (this.items.length < this.result.length) {
                this.items = this.result.slice(0, this.items.length + 10);
            }
        },
        search: function() {
            if (this.searchFor.trim() === '') {
                this.items = [];
                this.loading = true;
                this.$http
                    .get('/search/'.concat(this.searchFor))
                    .then(function(response) {
                        this.loading = false;
                        this.result = response.data;
                        this.items = response.data.slice(0, LOAD_NUM);
                        this.lastSearch = this.searchFor;
                    }, function(errorResponse) {
                        console.log('Oops...');
                    });
            }
        },
        addItem: function(index) {
            var item = this.items[index];
            var found = false;
            
            for (var i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id == item.id) {
                    this.cart[i].qty++;
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    price: this.price
                });
            }
            
            this.total += this.price;
        },
        increaseQty: function(index) {
            this.cart[index].qty++;
            
            this.total += this.cart[index].price;
        },
        decreaseQty: function(index) {
            this.cart[index].qty--;
            
            this.total -= this.cart[index].price;
            
            if (this.cart[index].qty === 0) {
                this.cart.splice(index, 1);
            }
            
        }
    },
    computed: {
        lastItem: function() {
            if (this.result.length > 0 && this.items.length === this.result.length) {
                return 'No more items';
            } else {
                return '';
            }
        }
    },
    filters: {
        currency: function(value) {
            return '$'.concat(value.toFixed(2));
        }
    },
    mounted: function() {
        this.$http
            .get('/search/'.concat(this.searchFor))
            .then(function(response) {
                this.loading = false;
                this.result = response.data
                this.items = response.data.slice(0, LOAD_NUM);
                this.lastSearch = this.searchFor;
            }, function(errorResponse) {
                console.log('Oops...');
            });
        
        var vm = this;
        var el = document.getElementById('product-list-bottom');
        var watcher = scrollMonitor.create(el);

        watcher.enterViewport(function() {
            vm.appendItems();
        });
    }
});