import { Card, CardContent, Typography, CardActions, Button, Paper } from "@material-ui/core"
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
            <div style={{ background: '#1a1b1c', "-webkit-filter": "blur(8px)", color: 'white', height: '250px' }}>
            </div>
            {/* <img src="/images/avengers.jpg" width='200px' height='270px' style={{ marginLeft: '15px', position: 'absolute', left: 0, top: '25%' }} /> */}
            <Paper elevation={3} style={{ marginTop: '25px', minHeight: '150px', }}>
                <div style={{ padding: '15px' }}>
                    <Typography variant='h4' component='h5'>
                        {ticket.title}
                    </Typography>
                    <Typography variant='body1' component='p' color='textSecondary'>
                        Drama | English
                    </Typography>
                    {new Date().toDateString()} Onwards
                    <br />
                    Coimbatore | ₹ {ticket.price}
                </div>
                <div style={{ padding: '15px' }}>
                    <Typography variant='subtitle1' component='p'>
                        Synopsis
                     </Typography>
                    <Typography>
                        The grave course of events set in motion by Thanos that wiped out half the universe and fractured the Avengers ranks compels the remaining Avengers to take one final stand in Marvel Studios` grand conclusion to twenty-two films, "Avengers: Endgame."
                     </Typography>
                </div>
                <br />
                <Button variant='contained' onClick={() => doRequest()} color="primary" style={{ margin: '15px' }}>Purchase</Button>
            </Paper>

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