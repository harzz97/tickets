import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Link from 'next/link';
import { Card, CardContent, Typography, CardActions, Button, CardMedia } from '@material-ui/core';

const cardStyle = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: '25px'
}
const LandingPage = ({ currentUser, tickets }) => {
    // console.log("CurrentUser", currentUser)
    // console.log("Tickets", tickets)
    return (
        <div>
            <div style={{ margin: '10px' }}>
                <h1>Now Showing</h1>
            </div>
            <div style={cardStyle}>
                {tickets.map((ticket) => {
                    return (
                        <Card key={ticket.id} >
                            <CardMedia
                                style={{ height: '200px' }}
                                image={'/images/avengers.jpg'}
                                title='poster'
                            />
                            <CardContent>
                                <Typography component="h2" variant='h5'>
                                    {ticket.title}
                                </Typography>

                                <Typography component="p" variant='body2'>
                                    Rs. {ticket.price} onwards
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                                    <Button size="small" color='primary'>Book Now</Button>
                                </Link>
                            </CardActions>
                        </Card>
                    )
                })}
            </div>

            {/* <TableContainer component={Paper}>
                <Table className="customTable">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell align="right">Price $</TableCell>
                            <TableCell align="right">View</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tickets.map((ticket) => (
                            <TableRow key={ticket.id}>
                                <TableCell component="th" scope="row">{ticket.title}</TableCell>
                                <TableCell align="right">{ticket.price}</TableCell>
                                <TableCell align="right">
                                    <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                                        <a>View</a>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer> */}
        </div>
    )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {

    const { data } = await client.get('/api/tickets')
    return { tickets: data }
}

export default LandingPage