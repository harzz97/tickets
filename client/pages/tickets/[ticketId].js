import { Card, CardContent, Typography, CardActions, Button } from "@material-ui/core"
import useRequest from "../../hooks/use-request"
import Router from 'next/router'

const TicketShow = ({ ticket }) => {
    const { doRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'post',
        body: {
            ticketId: ticket.id
        },
        onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
    })
    return (
        <div>
            <Card style={{ marginTop: "20px", width: "50%" }}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {ticket.title}
                    </Typography>
                    <Typography variant="body2" component="p">
                        Price: {ticket.price}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button onClick={() => doRequest()} size="medium" color="primary">Purchase</Button>
                </CardActions>
            </Card>
            <br />
            {errors}

        </div>

    )
}

TicketShow.getInitialProps = async (context, client) => {
    const { ticketId } = context.query

    const { data } = await client.get(`/api/tickets/${ticketId}`)
    return { ticket: data }
}
export default TicketShow