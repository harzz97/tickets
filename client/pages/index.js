import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
    // console.log("CurrentUser", currentUser)
    // console.log("Tickets", tickets)
    return (
        <div>
            <h1>Available Tickets</h1>
            <TableContainer component={Paper}>
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
            </TableContainer>
        </div>
    )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {

    const { data } = await client.get('/api/tickets')
    return { tickets: data }
}

export default LandingPage