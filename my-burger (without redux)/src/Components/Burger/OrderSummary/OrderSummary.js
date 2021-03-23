import React, { Component } from 'react';
import Auxiliary from '../../../hoc/Auxiliary/Auxiliary';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {

    render() {
        const ingredientSummary = Object.keys(this.props.ingredients)
            .map(igkey => {
                return (
                    <div key={igkey}>
                        <span style={{ textTransform: 'capitalize' }}>{igkey}</span>: {this.props.ingredients[igkey]}
                    </div>
                )
            })

        return (
            <Auxiliary>
                <h1>A delicious burger</h1>
                <p>a delicious burger with the following ingredient</p>
                <ul >
                    {ingredientSummary}
                </ul>
                <p><strong>Total Price: {this.props.totalPrice.toFixed(2)}</strong></p>
                <p>Continue to checkout?</p>
                <Button btnType='Danger' clicked={this.props.purchaseCancelled}>CANCEL</Button>
                <Button btnType='Success' clicked={this.props.purchaseContinued}>CONTINUE</Button>
            </Auxiliary>
        )
    }
}

export default OrderSummary;
