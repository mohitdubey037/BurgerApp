import React from 'react';
import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';
import classes from './CheckoutSummory.css'

const CheckoutSummory = (props) => {
    return (
        <div className={classes.CheckoutSummory}>
            <h1>We hope it taste well!</h1>
            <div style={{ width: '100%', margin: 'auto' }}>
                <Burger ingredients={props.ingredients} />
                <Button
                    btnType='Danger'
                    clicked = {props.checkoutCancelled}>CANCEL</Button>
                <Button
                    btnType='Success'
                    clicked = {props.checkoutContinued}>CONTINUE</Button>
            </div>
        </div>
    )
}
export default CheckoutSummory
