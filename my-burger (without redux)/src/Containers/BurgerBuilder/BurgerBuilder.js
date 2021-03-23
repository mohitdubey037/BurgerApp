import React, { Component } from 'react';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../Components/Burger/Burger';
import BuildControls from '../../Components/Burger/BuildControls/BuildControls';
import Modal from '../../Components/UI/Modal/Modal';
import OrderSummary from '../../Components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../Components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axiosInstance from '../../axios-orders';

const INGREDIENT_PRICE = {
    salad: 0.5,
    bacon: 0.7,
    cheese: 0.4,
    meat: 1.3,
}

class BurgerBuilder extends Component {

    // constructor(props){
    //     super(props);
    //     this.state = {}
    // }

    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error:false
    }

    componentDidMount() {
        axiosInstance.get('https://burger-builder-359fd-default-rtdb.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ ingredients: response.data });
            })
            .catch(error => {
                this.setState({error: true});
            })
    }

    addIngredienthandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const oldPrice = this.state.totalPrice;
        const priceAddition = INGREDIENT_PRICE[type];
        const newPrice = oldPrice + priceAddition;
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredienthandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount - 1;

        if (oldCount <= 0) {
            return
        }

        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const oldPrice = this.state.totalPrice;
        const priceDeduction = INGREDIENT_PRICE[type];
        const newPrice = oldPrice - priceDeduction;
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
        this.updatePurchaseState(updatedIngredients);
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(objKey => {
                return ingredients[objKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        this.setState({ purchasable: sum > 0 });
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true })
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        
        let queryParams = [];
        for (let i in this.state.ingredients){
              queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname : '/checkout',
            search : '?' + queryString
        })
    }

    render() {

        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummory = null;

        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;
        if (this.state.ingredients) {

            burger = (
                <Auxiliary>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ingredientAdded={this.addIngredienthandler}
                        ingredientRemoved={this.removeIngredienthandler}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler} />
                </Auxiliary>
            )

            orderSummory = <OrderSummary
            ingredients={this.state.ingredients}
            totalPrice={this.state.totalPrice}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}
        />
        }

        if (this.state.loading) {
            orderSummory = <Spinner />
        }  

        return (
            <Auxiliary>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
                    {orderSummory}
                </Modal>
                {burger}
            </Auxiliary>
        )
    }
}

export default withErrorHandler(BurgerBuilder, axiosInstance);
