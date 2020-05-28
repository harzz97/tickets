import { Typography, Button } from "@material-ui/core"
import { useState, useEffect } from "react"
import StripeCheckout from 'react-stripe-checkout'
import useRequest from "../../hooks/use-request"
import Router from "next/router"


const OrderShow = ({ order, currentUser }) => {
    const {doRequest, errors} = useRequest({
        url: "/api/payments",
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push('/orders')
    })
    const [timeLeft, setTimeLeft] = useState(0)
    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date()
            setTimeLeft(Math.round(msLeft / 1000))
        }
        findTimeLeft()
        const timerId = setInterval(findTimeLeft, 1000)

        return () => {
            clearInterval(timerId)
        }
    }, [order])

    if (timeLeft < 0) {
        return <div>Order has expired!</div>
    }
    return (
        <div>
            <Typography component='h4' variant="h4">
                Purchase {order.ticket.title}
            </Typography>
            <Typography component='p' variant="h5">
                Price: {order.ticket.price}
            </Typography>
            <StripeCheckout
                token={({ id }) => doRequest({ token: id })}
                stripeKey="pk_test_ACRS7UK4MSinnuG02JKl4Ath00274egU5v"
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
            <br />
            {errors}
        </div>
    )
}

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query

    const { data } = await client.get(`/api/orders/${orderId}`)
    console.log(data)
    return { order: data }
}
export default OrderShow