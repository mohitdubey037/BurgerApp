import React, { Component } from 'react';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../Components/Burger/Burger';
import BuildControls from '../../Components/Burger/BuildControls/BuildControls';
import Modal from '../../Components/UI/Modal/Modal';
import OrderSummary from '../../Components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../Components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axiosInstance from '../../axios-orders';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';



class BurgerBuilder extends Component {

    // constructor(props){
    //     super(props);
    //     this.state = {}
    // }

    state = {
        purchasable: false,
        purchasing: false,
        loading: false,
        error:false
    }

    // componentDidMount() {
    //     axiosInstance.get('https://burger-builder-359fd-default-rtdb.firebaseio.com/ingredients.json')
    //         .then(response => {
    //             this.setState({ ingredients: response.data });
    //         })
    //         .catch(error => {
    //             this.setState({error: true});
    //         })
    //  }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(objKey => {
                return ingredients[objKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        return sum > 0 ;
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true })
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout')
    }

    render() {

        const disabledInfo = {
            ...this.props.ings
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummory = null;

        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

        if (this.props.ings) {
            burger = (
                <Auxiliary>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={this.props.price}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        ordered={this.purchaseHandler}/>
                </Auxiliary>
            )

            orderSummory = <OrderSummary
            ingredients={this.props.ings}
            totalPrice={this.props.price}
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

const mapStateToProps = state => {
    return {
        ings : state.ingredients,
        price : state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded : (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved : (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axiosInstance));
