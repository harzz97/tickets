import { List,ListItem, ListItemText } from '@material-ui/core'
const OrderList = ({ orders }) => {
    return (
        <div>
            <List>
                {orders.map((order) => (
                    <ListItem key={order.id}>
                        <ListItemText>
                            {order.ticket.title} - {order.status}
                        </ListItemText>
                    </ListItem>
                ))
                }
            </List>
        </div>

    )
}

OrderList.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders')

    return { orders: data }
}

export default OrderList