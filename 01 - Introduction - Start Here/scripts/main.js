var React = require('react');
var ReactDOM = require('react-dom');
var h = require('./helpers.js');
//React Router
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
import { browserHistory } from 'react-router';
/*
    Header
    <Header />
 */
var Header = React.createClass({
    render: function (){
        return (
            <header className="top">
                <h1>Catch
                    <span className="ofThe">
                    <span className="of">Of</span>
                    <span className="the">The</span>
                    </span>
                    Day
                </h1>
                <h3 className= "tagline"><span>{this.props.tagline}</span></h3>
            </header>
        )
    }
});
/*
    Order
    <Order />
 */
var Order = React.createClass({
    render: function (){
        return <p>Order</p>
    }
});
/*
    Inventory
    <Inventory />
 */
var Inventory = React.createClass({
    render: function (){
        return (
            <div>
                <h2>Inventory</h2>
                <AddFishForm {...this.props} />
                <button onClick= {this.props.loadSamples}> Load Sample Fishes </button>
            </div>
        )
    }
});
/*
    Fish
    <Fish />
 */
var Fish = React.createClass({

    onButtonClick: function (){
        console.log('going to add the fish', this.props.index);
        this.props.addToOrder(this.props.index);
    },
    render: function (){
        var details = this.props.details
        var isAvailable = details.status === 'available' ? true: false;
        var buttonText= (isAvailable ? 'Add To Order' : 'Sold Out');
        return (
            <li className="menu-fish">
                <img src={details.image} alt={details.name} />
                <h3 className="fish-name">{details.name}
                    <span className="price">{h.formatPrice(details.price)}</span>
                </h3>
                <p>{details.desc}</p>
                <button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
            </li>
        )
    }
})
/*
    APP
 */
var App = React.createClass({
    getInitialState: function() {
            return {
                fishes: {},
                order: {}
            }
    },
    addFish: function (fish){
        var timestamp = new Date().getTime();
        //update state object
        this.state.fishes['fish-' + timestamp] = fish;
        //set the state
        this.setState({
            fishes: this.state.fishes
        }
    )
    },
    loadSamples: function (){
        this.setState({
            fishes : require('./sample-fishes.js')
        });
    },
    renderFish: function(key){
        return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>
    },
    addToOrder: function (key) {
        this.state.order[key] = this.state.order[key] + 1 || 1;
        this.setState({order: this.state.order});
    },
    render: function(){
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="list-of-fishes">
                    {Object.keys(this.state.fishes ).map(this.renderFish)}
                    </ul>
                </div>
                <Order />
                <Inventory addFish= {this.addFish} loadSamples={this.loadSamples}/>
            </div>
        );
    }
})
/*
    Add Fish Form
    <AddFishForm />
 */
var AddFishForm = React.createClass({
    createFish: function (event){
        //Stop the form from submitting
        event.preventDefault();

        //Take the data from the form and create an object
        var fish = {
            name: this.refs.name.value,
            price: this.refs.price.value,
            status: this.refs.status.value,
            description: this.refs.desc.value,
            image: this.refs.image.value
        };
        console.log(fish);
        //Add the fish to the App state
        this.props.addFish(fish);
    },
    render: function (){
        return (
            <form className="fish-edit" onSubmit={this.createFish}>
                <input type="text" ref="name" placeholder="Fish Name" />
                <input type="text" ref="price" placeholder="Fish Price" />
                <select ref="status">
                    <option value="available">Fresh!</option>
                    <option value="unavailable">Sold Out!</option>
                </select>
                <textarea type="text" ref="desc" placeholder="DESC"></textarea>
                <input type="text" ref="image" placeholder="URL to Image" />
                <button type="submit"> + Add Item</button>
                </form>
        )
    }
});

/*
*Store Picker Component
*This will let us make StorePicker
*/
var StorePicker = React.createClass({
    goToStore: function (event) {
        event.preventDefault();
        //get the data from the input
        //transition from storePicker to <App />
        var storeId = this.refs.storeid.value;
        browserHistory.push(`/store/${storeId}`);

        console.log('yeah submitted it');
    },
    render: function (){

        return (
            //Creating the store
            <form className="store-selector" onSubmit= {this.goToStore}>
                <h2>Please Enter A Store</h2>
                <input type="text" ref="storeid" defaultValue= {h.getFunName()} />
                <input type="submit" />
            </form>
        );
    }
});
/*
    Not Found
 */
var notFound = React.createClass({
    render: function (){
        return (
            <h1>Not Found</h1>
        )
    }
});

/*
    Routes
 */
var routes = (
    <Router history= {browserHistory} >
        <Route path="/" component={StorePicker} />
        <Route path="/store/:storeId" component={App}/>
        <Route path="*" component={notFound} />
    </Router>
)
    ReactDOM.render(routes, document.getElementById('main'));
